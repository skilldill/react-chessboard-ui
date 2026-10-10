import { JSChessEngine } from "../JSChessEngine";
import type { PieceColor, GameResult, MoveData, SquarePos, CellPos, Figure, FigureColor, Cell } from "../JSChessEngine";
import React, { useEffect, useRef } from "react";
import type { CSSProperties, FC } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import styles from './ChessBoard.module.css';
import { useChessBoardInteractive } from "./useChessBoardInteractive";
import { hasCheck } from "./utils";
import type { ChangeMove, ChessBoardConfig, ClickData } from "./models";
import { FigurePicker } from "./FigurePicker";
import { loadChessKit } from "./chessKit";
import type { ChessKitGeometries } from "./chessKit";

type ChessBoard3DProps = {
    FEN: string;
    onChange: (moveData: MoveData) => void;
    onEndGame: (result: GameResult) => void;
    onClick?: (data: ClickData) => void;
    change?: ChangeMove;
    reversed?: boolean;
    config?: Partial<ChessBoardConfig>;
    playerColor?: PieceColor;
    viewOnly?: boolean;
    moveHighlight?: [SquarePos, SquarePos];
    toggleTurn?: boolean;
    className?: string;
    style?: CSSProperties;
}

const CELL_SIZE = 1;
const BOARD_THICKNESS = 0.16;
const LIGHT_SQUARE = 0xd8c7a7;
const DARK_SQUARE = 0x745735;
const SELECTED_SQUARE = 0x5fa8ff;
const CHECKED_SQUARE = 0xe95b5c;
const POSSIBLE_SQUARE = 0x63d287;
const MOVE_SQUARE = 0xf6d365;
const WHITE_PIECE = 0xf4eee2;
const BLACK_PIECE = 0x24262b;
const WHITE_ACCENT = 0xb8aa90;
const BLACK_ACCENT = 0x4b505a;
const CLICK_THRESHOLD = 5;
const CAMERA_PADDING = 1.15;
const MOVE_DURATION = 120;
const CAPTURE_DURATION = 50;

type PieceVisual = {
    mesh: THREE.Group;
    figure: Figure;
};

type PieceAnimation = {
    from: THREE.Vector3;
    to: THREE.Vector3;
    startedAt: number;
    duration: number;
    captured: boolean;
};

type SceneRefs = {
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    controls: OrbitControls;
    boardGroup: THREE.Group;
    piecesGroup: THREE.Group;
    capturedGroup: THREE.Group;
    pieces: Map<string, PieceVisual>;
    animations: Map<THREE.Group, PieceAnimation>;
    pieceGeometries?: ChessKitGeometries;
    initialState?: Cell[][];
    lastMove?: ChangeMove;
    raycaster: THREE.Raycaster;
    pointer: THREE.Vector2;
    frameId: number;
    light: THREE.DirectionalLight;
}

const positionsEqual = (a?: CellPos, b?: CellPos) => {
    if (!a || !b) return false;
    return a[0] === b[0] && a[1] === b[1];
};

const hasPosition = (positions: CellPos[], pos: CellPos) =>
    positions.some((item) => positionsEqual(item, pos));

const getCellWorldPosition = (pos: CellPos, boardSize: number) => ({
    x: (pos[0] - (boardSize - 1) / 2) * CELL_SIZE,
    z: (pos[1] - (boardSize - 1) / 2) * CELL_SIZE,
});

const createMesh = (
    geometry: THREE.BufferGeometry,
    material: THREE.Material,
    position: [number, number, number],
    scale: [number, number, number] = [1, 1, 1],
) => {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(position[0], position[1], position[2]);
    mesh.scale.set(scale[0], scale[1], scale[2]);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    return mesh;
};

const addCylinder = (
    group: THREE.Group,
    material: THREE.Material,
    radiusTop: number,
    radiusBottom: number,
    height: number,
    y: number,
    segments = 40,
) => {
    group.add(createMesh(
        new THREE.CylinderGeometry(radiusTop, radiusBottom, height, segments),
        material,
        [0, y, 0],
    ));
};

const addBox = (
    group: THREE.Group,
    material: THREE.Material,
    size: [number, number, number],
    position: [number, number, number],
    rotation?: [number, number, number],
) => {
    const mesh = createMesh(new THREE.BoxGeometry(size[0], size[1], size[2]), material, position);
    if (rotation) mesh.rotation.set(rotation[0], rotation[1], rotation[2]);
    group.add(mesh);
};

const addSphere = (
    group: THREE.Group,
    material: THREE.Material,
    radius: number,
    position: [number, number, number],
    scale: [number, number, number] = [1, 1, 1],
) => {
    group.add(createMesh(
        new THREE.SphereGeometry(radius, 36, 18),
        material,
        position,
        scale,
    ));
};

const createFallbackPieceMesh = (figure: Figure) => {
    const group = new THREE.Group();
    group.userData.pieceSource = 'fallback';
    const mainMaterial = new THREE.MeshStandardMaterial({
        color: figure.color === 'white' ? WHITE_PIECE : BLACK_PIECE,
        roughness: 0.42,
        metalness: 0.08,
    });
    const accentMaterial = new THREE.MeshStandardMaterial({
        color: figure.color === 'white' ? WHITE_ACCENT : BLACK_ACCENT,
        roughness: 0.5,
        metalness: 0.04,
    });

    addCylinder(group, mainMaterial, 0.25, 0.31, 0.12, 0.06);
    addCylinder(group, accentMaterial, 0.18, 0.24, 0.08, 0.16);

    switch (figure.type) {
        case 'pawn':
            addCylinder(group, mainMaterial, 0.13, 0.18, 0.34, 0.37);
            addSphere(group, mainMaterial, 0.18, [0, 0.64, 0], [1, 1.08, 1]);
            break;
        case 'rook':
            addCylinder(group, mainMaterial, 0.2, 0.22, 0.44, 0.42);
            addCylinder(group, mainMaterial, 0.25, 0.22, 0.12, 0.70);
            for (let index = 0; index < 4; index += 1) {
                const angle = (Math.PI / 2) * index;
                addBox(group, mainMaterial, [0.12, 0.15, 0.1], [
                    Math.cos(angle) * 0.17,
                    0.84,
                    Math.sin(angle) * 0.17,
                ]);
            }
            break;
        case 'knight':
            addCylinder(group, mainMaterial, 0.14, 0.2, 0.34, 0.36);
            addBox(group, mainMaterial, [0.22, 0.46, 0.28], [0.04, 0.66, -0.04], [0.35, 0, -0.14]);
            addBox(group, accentMaterial, [0.16, 0.18, 0.22], [0.11, 0.86, -0.18], [0.35, 0, -0.14]);
            break;
        case 'bishop':
            addCylinder(group, mainMaterial, 0.13, 0.2, 0.34, 0.36);
            addSphere(group, mainMaterial, 0.22, [0, 0.66, 0], [0.78, 1.25, 0.78]);
            addBox(group, accentMaterial, [0.035, 0.32, 0.24], [0.03, 0.72, 0], [0, 0, -0.55]);
            addSphere(group, mainMaterial, 0.07, [0, 0.94, 0]);
            break;
        case 'queen':
            addCylinder(group, mainMaterial, 0.12, 0.21, 0.38, 0.38);
            addCylinder(group, mainMaterial, 0.22, 0.15, 0.2, 0.67);
            for (let index = 0; index < 6; index += 1) {
                const angle = (Math.PI * 2 / 6) * index;
                addSphere(group, mainMaterial, 0.055, [
                    Math.cos(angle) * 0.18,
                    0.83,
                    Math.sin(angle) * 0.18,
                ]);
            }
            addSphere(group, accentMaterial, 0.075, [0, 0.91, 0]);
            break;
        case 'king':
            addCylinder(group, mainMaterial, 0.14, 0.21, 0.42, 0.4);
            addSphere(group, mainMaterial, 0.17, [0, 0.68, 0], [1, 0.82, 1]);
            addBox(group, accentMaterial, [0.09, 0.33, 0.07], [0, 0.93, 0]);
            addBox(group, accentMaterial, [0.25, 0.075, 0.07], [0, 0.99, 0]);
            break;
    }

    group.traverse((child: THREE.Object3D) => {
        child.userData.figure = figure;
    });

    return group;
};

const createPieceMesh = (figure: Figure, geometries?: ChessKitGeometries) => {
    if (!geometries) return createFallbackPieceMesh(figure);

    const group = new THREE.Group();
    group.userData.pieceSource = 'chess-kit';
    const mesh = createMesh(geometries[figure.type], new THREE.MeshStandardMaterial({
        color: figure.color === 'white' ? WHITE_PIECE : BLACK_PIECE,
        roughness: 0.42,
        metalness: 0.08,
        side: THREE.DoubleSide,
    }), [0, 0, 0]);
    // Cached geometry is shared across boards; capture opacity belongs to each piece's own material.
    mesh.userData.sharedGeometry = true;
    if (figure.type === 'knight') {
        mesh.rotation.y = figure.color === 'white' ? 0 : -Math.PI;
    }
    group.add(mesh);
    return group;
};

const disposeObject = (object: THREE.Object3D) => {
    object.traverse((child: THREE.Object3D) => {
        const mesh = child as THREE.Mesh;
        if (mesh.geometry && !mesh.userData.sharedGeometry) mesh.geometry.dispose();
        const material = mesh.material;
        if (Array.isArray(material)) {
            material.forEach((item) => item.dispose());
        } else if (material) {
            material.dispose();
        }
    });
};

const findCellPos = (object: THREE.Object3D): CellPos | undefined => {
    let current: THREE.Object3D | null = object;
    while (current) {
        if (current.userData.cellPos) return current.userData.cellPos;
        current = current.parent;
    }

    return undefined;
};

const setPieceCell = (piece: PieceVisual, pos: CellPos) => {
    piece.mesh.traverse((child) => {
        child.userData.cellPos = pos;
        child.userData.figure = piece.figure;
    });
};

const animatePieces = (refs: SceneRefs, now: number) => {
    refs.animations.forEach((animation, mesh) => {
        const progress = Math.min(1, (now - animation.startedAt) / animation.duration);
        const eased = animation.captured
            ? 1 - Math.pow(1 - progress, 3)
            : progress * progress * (3 - 2 * progress);
        mesh.position.lerpVectors(animation.from, animation.to, eased);

        if (animation.captured) {
            mesh.traverse((child) => {
                if (!(child instanceof THREE.Mesh)) return;
                const materials = Array.isArray(child.material) ? child.material : [child.material];
                materials.forEach((material) => { material.opacity = 1 - progress; });
            });
        }

        if (progress === 1) {
            refs.animations.delete(mesh);
            if (animation.captured) {
                mesh.removeFromParent();
                disposeObject(mesh);
            }
        }
    });
};

export const ChessBoard3D: FC<ChessBoard3DProps> = (props) => {
    const {
        FEN,
        onChange,
        onEndGame,
        onClick,
        change,
        reversed,
        config,
        playerColor,
        viewOnly,
        moveHighlight,
        toggleTurn = true,
        className,
        style,
    } = props;

    const hostRef = useRef<HTMLDivElement>(null);
    const sceneRef = useRef<SceneRefs | undefined>(undefined);
    const gestureRef = useRef<{
        pointerId: number;
        x: number;
        y: number;
        dragged: boolean;
    } | undefined>(undefined);

    const {
        invalidFEN,
        boardConfig,
        actualState,
        initialState,
        newMove,
        animated,
        currentColor,
        linesWithCheck,
        clickedPos,
        clickPossibleMoves,
        showFigurePicker,
        setInvalidFEN,
        setPlayerColor,
        handleUpdateFEN,
        handleClick,
        handleSelectFigurePicker,
        handleChangeFromExternal,
    } = useChessBoardInteractive({
        onChange,
        onEndGame,
        onClickByChessBoard: onClick,
        config,
        toggleTurn,
    });

    useEffect(() => {
        setPlayerColor(playerColor);
    }, [playerColor]);

    useEffect(() => {
        handleUpdateFEN(FEN, Boolean(reversed));
    }, [FEN, reversed]);

    useEffect(() => {
        if (!change) return;
        const reversedChange = reversed ? JSChessEngine.reverseMove(change.move) : change.move;
        handleChangeFromExternal(reversedChange, change.withTransition);
    }, [change]);

    useEffect(() => {
        const host = hostRef.current;
        if (!host) return undefined;

        const scene = new THREE.Scene();
        // scene.background = new THREE.Color(0xf6f4ef);

        const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
        camera.position.set(0, 9.4, 11.2).multiplyScalar(CAMERA_PADDING);
        camera.lookAt(0, 0, 0);

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        host.appendChild(renderer.domElement);
        renderer.domElement.style.cursor = 'grab';

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.enablePan = false;
        controls.enableZoom = true;
        controls.zoomSpeed = 0.8;
        controls.minPolarAngle = Math.PI / 6;
        controls.maxPolarAngle = Math.PI / 2.8;
        controls.update();

        const boardGroup = new THREE.Group();
        scene.add(boardGroup);
        const piecesGroup = new THREE.Group();
        const capturedGroup = new THREE.Group();
        scene.add(piecesGroup, capturedGroup);

        const ambientLight = new THREE.HemisphereLight(0xffffff, 0x6c665f, 1.9);
        scene.add(ambientLight);

        const light = new THREE.DirectionalLight(0xffffff, 2.2);
        light.position.set(3.5, 7, 4.5);
        light.castShadow = true;
        light.shadow.mapSize.set(2048, 2048);
        scene.add(light);

        const floor = new THREE.Mesh(
            new THREE.PlaneGeometry(26, 26),
            new THREE.ShadowMaterial({ opacity: 0.14 }),
        );
        floor.rotation.x = -Math.PI / 2;
        floor.position.y = -0.04;
        floor.receiveShadow = true;
        scene.add(floor);

        const refs: SceneRefs = {
            renderer,
            scene,
            camera,
            controls,
            boardGroup,
            piecesGroup,
            capturedGroup,
            pieces: new Map(),
            animations: new Map(),
            raycaster: new THREE.Raycaster(),
            pointer: new THREE.Vector2(),
            frameId: 0,
            light,
        };

        sceneRef.current = refs;

        void loadChessKit().then((geometries) => {
            if (!geometries || sceneRef.current !== refs) return;
            refs.pieceGeometries = geometries;
            refs.pieces.forEach((piece) => {
                const replacement = createPieceMesh(piece.figure, geometries);
                disposeObject(piece.mesh);
                piece.mesh.clear();
                [...replacement.children].forEach((child) => piece.mesh.add(child));
                piece.mesh.userData.pieceSource = 'chess-kit';
                setPieceCell(piece, piece.mesh.userData.cellPos);
            });
        });

        const resize = () => {
            const rect = host.getBoundingClientRect();
            const width = Math.max(1, rect.width);
            const height = Math.max(1, rect.height);
            renderer.setSize(width, height);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
        };

        const resizeObserver = new ResizeObserver(resize);
        resizeObserver.observe(host);
        resize();

        const animate = () => {
            const time = performance.now() * 0.001;
            light.position.x = 3.5 + Math.sin(time * 0.35) * 0.35;
            controls.update();
            animatePieces(refs, performance.now());
            renderer.render(scene, camera);
            refs.frameId = window.requestAnimationFrame(animate);
        };
        animate();

        return () => {
            resizeObserver.disconnect();
            window.cancelAnimationFrame(refs.frameId);
            controls.dispose();
            disposeObject(boardGroup);
            disposeObject(piecesGroup);
            disposeObject(capturedGroup);
            refs.animations.clear();
            refs.pieces.clear();
            floor.geometry.dispose();
            (floor.material as THREE.Material).dispose();
            renderer.dispose();
            renderer.domElement.remove();
            sceneRef.current = undefined;
        };
    }, []);

    useEffect(() => {
        const refs = sceneRef.current;
        if (!refs || actualState.length === 0) return;

        disposeObject(refs.boardGroup);
        refs.boardGroup.clear();

        const boardSize = actualState.length;
        const boardWidth = boardSize * CELL_SIZE;
        const boardBase = new THREE.Mesh(
            new THREE.BoxGeometry(boardWidth + 0.32, BOARD_THICKNESS, boardWidth + 0.32),
            new THREE.MeshStandardMaterial({
                color: 0x3c2b1c,
                roughness: 0.52,
                metalness: 0.1,
            }),
        );
        boardBase.position.y = -BOARD_THICKNESS / 2;
        boardBase.receiveShadow = true;
        refs.boardGroup.add(boardBase);

        actualState.forEach((row, y) => {
            row.forEach((cell, x) => {
                const pos: CellPos = [x, y];
                const { x: worldX, z: worldZ } = getCellWorldPosition(pos, boardSize);
                const isLight = (x + y) % 2 === 0;
                const isSelected = positionsEqual(clickedPos, pos);
                const isPossible = hasPosition(clickPossibleMoves, pos);
                const isChecked = hasCheck(cell, currentColor, linesWithCheck);
                const isMoveHighlighted = moveHighlight && (
                    positionsEqual(moveHighlight[0], pos) || positionsEqual(moveHighlight[1], pos)
                );

                const squareColor = isChecked
                    ? CHECKED_SQUARE
                    : isSelected
                        ? SELECTED_SQUARE
                        : isMoveHighlighted
                            ? MOVE_SQUARE
                            : isLight
                                ? LIGHT_SQUARE
                                : DARK_SQUARE;

                const square = new THREE.Mesh(
                    new THREE.BoxGeometry(CELL_SIZE, 0.09, CELL_SIZE),
                    new THREE.MeshStandardMaterial({
                        color: squareColor,
                        roughness: 0.5,
                        metalness: 0.04,
                    }),
                );
                square.position.set(worldX, 0, worldZ);
                square.userData.cellPos = pos;
                square.receiveShadow = true;
                refs.boardGroup.add(square);

                if (isPossible) {
                    const marker = new THREE.Mesh(
                        cell.figure
                            ? new THREE.RingGeometry(0.4, 0.47, 32)
                            : new THREE.CylinderGeometry(0.16, 0.16, 0.018, 32),
                        new THREE.MeshStandardMaterial({
                            color: POSSIBLE_SQUARE,
                            transparent: true,
                            opacity: 0.72,
                            roughness: 0.4,
                        }),
                    );
                    if (cell.figure) marker.rotation.x = -Math.PI / 2;
                    marker.position.set(worldX, 0.065, worldZ);
                    marker.userData.cellPos = pos;
                    refs.boardGroup.add(marker);
                }
            });
        });
    }, [actualState, clickedPos, clickPossibleMoves, moveHighlight, currentColor, linesWithCheck]);

    useEffect(() => {
        const refs = sceneRef.current;
        if (!refs || actualState.length === 0) return;

        const reset = refs.initialState !== initialState;
        if (reset) {
            disposeObject(refs.piecesGroup);
            disposeObject(refs.capturedGroup);
            refs.piecesGroup.clear();
            refs.capturedGroup.clear();
            refs.pieces.clear();
            refs.animations.clear();
        }
        const withTransition = !reset && (refs.lastMove === newMove || animated);
        refs.initialState = initialState;
        refs.lastMove = newMove;

        const remaining = new Map(refs.pieces);
        const nextPieces = new Map<string, PieceVisual>();
        const destinations: { key: string; pos: CellPos; figure: Figure }[] = [];

        actualState.forEach((row, y) => row.forEach((cell, x) => {
            if (!cell.figure) return;
            const key = `${x},${y}`;
            const previous = remaining.get(key);
            if (previous?.figure.type === cell.figure.type && previous.figure.color === cell.figure.color) {
                previous.figure = cell.figure;
                nextPieces.set(key, previous);
                remaining.delete(key);
            } else {
                destinations.push({ key, pos: [x, y], figure: cell.figure });
            }
        }));

        // Only changed cells participate, so castling also matches the rook and en passant leaves the captured pawn.
        destinations.forEach(({ key, pos, figure }) => {
            let source = Array.from(remaining).find(([, piece]) =>
                piece.figure.type === figure.type && piece.figure.color === figure.color);
            if (!source && figure.type !== 'pawn') {
                source = Array.from(remaining).find(([sourceKey, piece]) =>
                    piece.figure.type === 'pawn' && piece.figure.color === figure.color &&
                    (sourceKey === key || pos[1] === 0 || pos[1] === actualState.length - 1));
            }

            let piece: PieceVisual;
            if (source) {
                remaining.delete(source[0]);
                piece = source[1];
                if (piece.figure.type !== figure.type) {
                    const oldMesh = piece.mesh;
                    piece.mesh = createPieceMesh(figure, refs.pieceGeometries);
                    piece.mesh.position.copy(oldMesh.position);
                    const animation = refs.animations.get(oldMesh);
                    if (animation) refs.animations.set(piece.mesh, animation);
                    refs.animations.delete(oldMesh);
                    oldMesh.removeFromParent();
                    disposeObject(oldMesh);
                    refs.piecesGroup.add(piece.mesh);
                }
                piece.figure = figure;
            } else {
                piece = { mesh: createPieceMesh(figure, refs.pieceGeometries), figure };
                refs.piecesGroup.add(piece.mesh);
            }

            const { x, z } = getCellWorldPosition(pos, actualState.length);
            const target = new THREE.Vector3(x, 0.07, z);
            if (source && source[0] !== key && withTransition) {
                refs.animations.set(piece.mesh, {
                    from: piece.mesh.position.clone(),
                    to: target,
                    startedAt: performance.now(),
                    duration: MOVE_DURATION,
                    captured: false,
                });
            } else if (!refs.animations.has(piece.mesh) || !withTransition) {
                refs.animations.delete(piece.mesh);
                piece.mesh.position.copy(target);
            }
            setPieceCell(piece, pos);
            nextPieces.set(key, piece);
        });

        remaining.forEach((piece) => {
            refs.animations.delete(piece.mesh);
            if (!withTransition) {
                piece.mesh.removeFromParent();
                disposeObject(piece.mesh);
                return;
            }

            refs.capturedGroup.add(piece.mesh);
            piece.mesh.traverse((child) => {
                delete child.userData.cellPos;
                if (!(child instanceof THREE.Mesh)) return;
                child.castShadow = false;
                const materials = Array.isArray(child.material) ? child.material : [child.material];
                materials.forEach((material) => {
                    material.transparent = true;
                    material.depthWrite = false;
                });
            });
            // Camera-right keeps the exit direction consistent even after rotating the board.
            refs.camera.updateMatrixWorld();
            const direction = new THREE.Vector3().setFromMatrixColumn(refs.camera.matrixWorld, 0);
            direction.y = 0;
            direction.normalize().multiplyScalar(piece.figure.color === 'white' ? 5 : -5);
            refs.animations.set(piece.mesh, {
                from: piece.mesh.position.clone(),
                to: piece.mesh.position.clone().add(direction),
                startedAt: performance.now(),
                duration: CAPTURE_DURATION,
                captured: true,
            });
        });
        refs.pieces = nextPieces;
    }, [actualState, initialState, newMove, animated]);

    useEffect(() => {
        const refs = sceneRef.current;
        if (!refs || actualState.length === 0) return;

        const boardSize = actualState.length;
        const distance = Math.hypot(Math.max(9.4, boardSize * 1.18), Math.max(11.2, boardSize * 1.4)) * CAMERA_PADDING;
        refs.controls.minDistance = distance * 0.55;
        refs.controls.maxDistance = distance * 2;
        refs.camera.position.sub(refs.controls.target).setLength(distance).add(refs.controls.target);
        refs.controls.update();
    }, [actualState.length]);

    const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
        if (!event.isPrimary) {
            gestureRef.current = undefined;
            return;
        }
        if (event.button !== 0) return;

        gestureRef.current = {
            pointerId: event.pointerId,
            x: event.clientX,
            y: event.clientY,
            dragged: false,
        };
    };

    const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
        const gesture = gestureRef.current;
        if (!gesture || gesture.pointerId !== event.pointerId) return;

        if (Math.hypot(event.clientX - gesture.x, event.clientY - gesture.y) > CLICK_THRESHOLD) {
            gesture.dragged = true;
        }
    };

    const handlePointerCancel = () => {
        gestureRef.current = undefined;
    };

    const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
        const gesture = gestureRef.current;
        gestureRef.current = undefined;
        if (!gesture || gesture.pointerId !== event.pointerId || gesture.dragged) return;
        if (Math.hypot(event.clientX - gesture.x, event.clientY - gesture.y) > CLICK_THRESHOLD) return;

        const refs = sceneRef.current;
        const host = hostRef.current;
        if (!refs || !host) return;

        const rect = host.getBoundingClientRect();
        refs.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        refs.pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        refs.raycaster.setFromCamera(refs.pointer, refs.camera);

        const intersections = refs.raycaster.intersectObjects([
            ...refs.boardGroup.children,
            ...refs.piecesGroup.children,
        ], true);
        const cellPos = intersections.length > 0 ? findCellPos(intersections[0].object) : undefined;
        if (!cellPos) return;

        handleClick(cellPos, viewOnly);
    };

    const handleHideInvalidFENmessage = (event: React.MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();
        setInvalidFEN(false);
    }

    return (
        <div
            className={className}
            style={{
                position: 'relative',
                width: boardConfig.squareSize * (actualState.length || 8),
                maxWidth: '100%',
                aspectRatio: '1 / 1',
                ...style,
            }}
        >
            <div
                ref={hostRef}
                aria-label={`3D chessboard. ${currentColor} to move.`}
                role="application"
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerCancel}
                onLostPointerCapture={handlePointerCancel}
                style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    overflow: 'hidden',
                    borderRadius: 8,
                    cursor: 'grab',
                    touchAction: 'none',
                    boxShadow: '0 18px 44px rgba(42, 34, 25, 0.22)',
                }}
            />

            {showFigurePicker && (
                <div
                    className={styles.chessBoardPiecePicker}
                    style={{
                        left: '50%',
                        top: '50%',
                        transform: 'translate(-50%, -50%)',
                    }}
                >
                    <FigurePicker
                        boardConfig={boardConfig}
                        color={currentColor as FigureColor}
                        forPawnTransform
                        onSelect={handleSelectFigurePicker}
                    />
                </div>
            )}

            {invalidFEN && (
                <div className={styles.chessBoardInvalidFenMessage}>
                    <div className={styles.fenErrorMessage} role="alert">
                        <div>
                            Invalid FEN notation. The default board position was used instead.{" "}
                            <a href="https://react-chessboard-ui.dev/docs/fen-errors">
                                See common FEN problems
                            </a>
                            .
                        </div>
                        <div>
                            <a className={styles.fenErrorMessageClose} onClick={handleHideInvalidFENmessage}>Hide this message</a>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
