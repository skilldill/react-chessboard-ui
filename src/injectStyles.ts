import css from './ChessBoard/ChessBoard.module.css?inline';

const STYLE_ID = 'react-chessboard-ui-styles';

if (typeof document !== 'undefined' && !document.getElementById(STYLE_ID)) {
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = css;
    document.head.appendChild(style);
}
