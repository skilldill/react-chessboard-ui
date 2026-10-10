import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import type { FigureType } from "../JSChessEngine";
import kitDocument from "../../blob/chess_kit/scene.gltf?raw";
import kitBufferUrl from "../../blob/chess_kit/scene.bin?url";

export type ChessKitGeometries = Record<FigureType, THREE.BufferGeometry>;
const KING_HEIGHT = 1.35;

// The source merges six pieces into two meshes arranged along world Z.
const PIECE_RANGES: { type: FigureType; min: number; max: number }[] = [
    { type: 'pawn', min: -15, max: -10.8 },
    { type: 'rook', min: -10.8, max: -6.5 },
    { type: 'knight', min: -6.5, max: -2.2 },
    { type: 'bishop', min: -2.2, max: 2.4 },
    { type: 'queen', min: 2.4, max: 7.4 },
    { type: 'king', min: 7.4, max: 12 },
];

const extractGeometries = (scene: THREE.Group): ChessKitGeometries => {
    const parts = PIECE_RANGES.map(() => ({ positions: [] as number[], normals: [] as number[], indices: [] as number[] }));
    const geometries = {} as ChessKitGeometries;
    scene.updateMatrixWorld(true);

    try {
        scene.traverse((object) => {
            if (!(object instanceof THREE.Mesh)) return;
            const geometry = object.geometry.clone().applyMatrix4(object.matrixWorld);
            try {
                const positions = geometry.getAttribute('position');
                if (!positions || !geometry.index) throw new Error('Invalid Chess Kit geometry');
                if (!geometry.getAttribute('normal')) geometry.computeVertexNormals();
                const normals = geometry.getAttribute('normal');
                const vertices = PIECE_RANGES.map(() => new Map<number, number>());

                for (let i = 0; i < geometry.index.count; i += 3) {
                    const triangle = [0, 1, 2].map((j) => geometry.index!.getX(i + j));
                    const pieceIndex = PIECE_RANGES.findIndex(({ min, max }) =>
                        triangle.every((vertex) => positions.getZ(vertex) >= min && positions.getZ(vertex) < max));
                    if (pieceIndex < 0) throw new Error('Chess Kit pieces could not be separated');

                    const part = parts[pieceIndex];
                    const used = vertices[pieceIndex];
                    triangle.forEach((vertex) => {
                        let localIndex = used.get(vertex);
                        if (localIndex === undefined) {
                            localIndex = part.positions.length / 3;
                            used.set(vertex, localIndex);
                            part.positions.push(positions.getX(vertex), positions.getY(vertex), positions.getZ(vertex));
                            part.normals.push(normals.getX(vertex), normals.getY(vertex), normals.getZ(vertex));
                        }
                        part.indices.push(localIndex);
                    });
                }
            } finally {
                geometry.dispose();
            }
        });

        PIECE_RANGES.forEach(({ type }, i) => {
            const part = parts[i];
            if (!part.indices.length) throw new Error(`Missing Chess Kit piece: ${type}`);
            const geometry = new THREE.BufferGeometry();
            geometries[type] = geometry;
            geometry.setAttribute('position', new THREE.Float32BufferAttribute(part.positions, 3));
            geometry.setAttribute('normal', new THREE.Float32BufferAttribute(part.normals, 3));
            geometry.setIndex(part.indices);
            geometry.computeBoundingBox();
            const bounds = geometry.boundingBox!;
            const center = bounds.getCenter(new THREE.Vector3());
            geometry.translate(-center.x, -bounds.min.y, -center.z);
        });

        geometries.king.computeBoundingBox();
        const height = geometries.king.boundingBox!.getSize(new THREE.Vector3()).y;
        if (!Number.isFinite(height) || height <= 0) throw new Error('Invalid Chess Kit scale');
        const scale = KING_HEIGHT / height;
        Object.values(geometries).forEach((geometry) => {
            geometry.scale(scale, scale, scale);
            geometry.computeBoundingBox();
            geometry.computeBoundingSphere();
        });
        return geometries;
    } catch (error) {
        Object.values(geometries).forEach((geometry) => geometry.dispose());
        throw error;
    } finally {
        const sourceGeometries = new Set<THREE.BufferGeometry>();
        const sourceMaterials = new Set<THREE.Material>();
        scene.traverse((object) => {
            if (!(object instanceof THREE.Mesh)) return;
            sourceGeometries.add(object.geometry);
            const materials = Array.isArray(object.material) ? object.material : [object.material];
            materials.forEach((material) => sourceMaterials.add(material));
        });
        sourceGeometries.forEach((geometry) => geometry.dispose());
        sourceMaterials.forEach((material) => material.dispose());
    }
};

let loadPromise: Promise<ChessKitGeometries | undefined> | undefined;

export const loadChessKit = (): Promise<ChessKitGeometries | undefined> => {
    if (!loadPromise) {
        loadPromise = Promise.resolve().then(async () => {
            const document = JSON.parse(kitDocument);
            document.buffers[0].uri = kitBufferUrl;
            const gltf = await new GLTFLoader().parseAsync(JSON.stringify(document), '');
            return extractGeometries(gltf.scene);
        }).catch((): undefined => {
            loadPromise = undefined;
            return undefined;
        });
    }
    return loadPromise;
};
