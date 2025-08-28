import { useState } from 'react';
import PropTypes from 'prop-types';
import {IconAction} from "../../../assets/style/Icon";
import { ButtonSimple } from '../../../assets/style/Buttons';
import Colors from '../../../../utils/colors';

const ModalDetail = ({title, children}) => {
  const [showModal, setShowModal] = useState(false);

  const ouvrirModal = () => setShowModal(true);
  const fermerModal = () => setShowModal(false);

  return (
    <>
    
      
      <ButtonSimple onClick={ouvrirModal}>
        <IconAction className="fa fa-eye "/>
      </ButtonSimple>

      {showModal && (
        <div className="modal show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header" style={{ backgroundColor:Colors.secondary }}>
                <h5 className="modal-title">{title}</h5>
                <button type="button" className="btn-close" onClick={fermerModal}></button>
              </div>
              <div className="modal-body">
                { children}
              </div>
              {/* <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={fermerModal}>
                  Fermer
                </button>
              </div> */}
            </div>
          </div>
        </div>
      )}

      {/* Optionnel : fond sombre */}
      {/* {showModal && <div className="modal-backdrop show"></div>} */}
    </>
  );
};
export default ModalDetail;

ModalDetail.propTypes = {
  index: PropTypes.number.isRequired,
  enquete: PropTypes.object.isRequired,
};