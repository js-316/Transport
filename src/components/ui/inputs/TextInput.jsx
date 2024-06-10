

const TextInput = ({ name, label, register, error, ...rest}) => {
    return (
        <>
            <div className="form-label-group">
                <label htmlFor={name}>{label}</label>
            </div>
            <input
                type="text"
                name={name}
                id={name}
                className={error ? "form-control is-invalid" : "form-control"}
                {...register(name)}
                {...rest}
            />
            {error && <span className="invalid-feedback mt-2">{error.message}</span>}
        </>
    );
}

export default TextInput;