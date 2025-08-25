import FormTitle from "./FormTitle";
import "../../../../assets/style/common.css"


function FormContainer({ children, formTitle, buttonTitle=null, onSubmit }) {
    return (
        <div className="row marge-form">
            <FormTitle title={formTitle} />
                {children}
           
        </div>
    );
}
export default FormContainer;