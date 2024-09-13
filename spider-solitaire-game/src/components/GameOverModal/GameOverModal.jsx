import Modal from 'react-modal';
import PropTypes from 'prop-types';

Modal.setAppElement('#root'); // For accessibility reasons

const GameOverModal = ({ isOpen, message, points, onRestart, onExit }) => (
    <Modal
        isOpen={isOpen}
        onRequestClose={onExit}
        contentLabel="Game Over"
        className="modal"
        overlayClassName="overlay"
    >
        <h2>{message}</h2>
        {points !== undefined && <p>Your Points: {points}</p>}
        <div className="modal-buttons">
            <button onClick={onRestart}>Restart</button>
            <button onClick={onExit}>Exit</button>
        </div>
    </Modal>
);

GameOverModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    message: PropTypes.string.isRequired,
    points: PropTypes.number, 
    onRestart: PropTypes.func.isRequired,
    onExit: PropTypes.func.isRequired
};

export default GameOverModal;
