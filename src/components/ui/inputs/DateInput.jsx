const DateInput = ({name, label, value, register, error, ...rest}) => {
    return (
        <>
            <div className="form-group">
                <label htmlFor={name}>{label}</label>
                <input
                    type="date"
                    name={name}
                    id={name}
                    className={`form-control ${error ? 'is-invalid' : ''}`}
                    {...register(name, {required: true})}
                    {...rest}
                />
            </div>
            {error && <span className="invalid-feedback mt-2">{error.message}</span>}
        </>
    )
}

export default DateInput