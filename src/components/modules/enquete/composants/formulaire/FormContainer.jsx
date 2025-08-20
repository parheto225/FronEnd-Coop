import FormTitle from "./FormTitle";
import { ButtonSubmit } from "../../../../assets/style/Buttons";
import "../../../../assets/style/common.css"


function FormContainer({ children, formTitle, buttonTitle, onSubmit }) {
    return (
        <div className="row marge-form">
            <FormTitle title={formTitle} />
            {children}

            <div className="col-12 position-flex">
                <ButtonSubmit onClick={onSubmit}>{buttonTitle}</ButtonSubmit>
            </div>
        </div>
    );
}
export default FormContainer;