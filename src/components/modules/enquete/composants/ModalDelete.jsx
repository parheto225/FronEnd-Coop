import { useState } from 'react';
import PropTypes from 'prop-types';

import Colors from '../../../../utils/colors';

const ModalDelete = ({title, size="lg", show=false, children, onConfirm, onClose}) => {
  const [activeButton, setActiveButton] = useState(false);

const handleConfirm = () => {
    setActiveButton(true);
    onConfirm();
    setActiveButton(false);
    onClose();
};
if (!show) return null;
  return (
    <>
        <div className="modal show d-block" tabIndex="-1" role="dialog">
          <div className={`modal-dialog modal-dialog-scrollable modal-${size}`} role="document">
            <div className="modal-content">
              <div className="modal-header" style={{ backgroundColor:Colors.secondary }}>
                <h5 className="modal-title">{title}</h5>
                <button type="button" className="btn-close" onClick={onClose} disabled={activeButton}></button>
              </div>
              <div className="modal-body">
                { children}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn" style={{ backgroundColor:Colors.secondary, color:Colors.white }} onClick={onClose} disabled={activeButton}>
                  Annuler
                </button>
                <button type="button" className="btn" style={{ backgroundColor:Colors.primary, color:Colors.white }} onClick={handleConfirm} disabled={activeButton}>
                  Confirmer
                </button>
              </div>
            </div>
          </div>
        </div>
    </>
  );
};
export default ModalDelete;

ModalDelete.propTypes = {
  title: PropTypes.string.isRequired,
  show: PropTypes.bool,
  children: PropTypes.node,
  onConfirm: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};