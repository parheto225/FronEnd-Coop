import { useState } from 'react';
import PropTypes from 'prop-types';

const ModalDetailEnquete = ({index, enquete}) => {
  const [showModal, setShowModal] = useState(false);

  const ouvrirModal = () => setShowModal(true);
  const fermerModal = () => setShowModal(false);

  return (
    <div>
      
      <button className="btn btn-sm" onClick={ouvrirModal}>
        <i className="fa fa-eye"></i>
      </button>

      {showModal && (
        <div className="modal show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{enquete.libelle}</h5>
                <button type="button" className="btn-close" onClick={fermerModal}></button>
              </div>
              <div className="modal-body">
                <p>Voici le contenu du modal Bootstrap dans React.</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={fermerModal}>
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Optionnel : fond sombre */}
      {/* {showModal && <div className="modal-backdrop show"></div>} */}
    </div>
  );
};
export default ModalDetailEnquete;

ModalDetailEnquete.propTypes = {
  index: PropTypes.number.isRequired,
  enquete: PropTypes.object.isRequired,
};