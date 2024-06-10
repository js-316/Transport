import {Link} from "react-router-dom";

const PasswordInput = ({name, label, register, error, ...rest}) => {
    return (
        <>
            <div className="form-label-group">
                <label htmlFor={name}>{label}</label>
                <Link to={"/forgot-password"} className={"fs-7 fw-medium"}>Forgot Password?</Link>
            </div>
            <div className={"input-group password-check"}>
                <span className={"input-affix-wrapper"}>
                    <input
                        type="password"
                        name={name}
                        id={name}
                        className={error ? "form-control is-invalid" : "form-control"}
                        {...register(name)}
                        {...rest}
                    />
                    {error && <span className="invalid-feedback mt-2">{error.message}</span>}
                </span>
            </div>

        </>
    );
}

export default PasswordInput;