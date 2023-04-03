import {Link} from "react-router-dom";
import {useForm} from "react-hook-form";
import {EmailInput, PasswordInput} from "@components/ui/";
import {yupResolver} from "@hookform/resolvers/yup";
import {loginSchema} from "@validations/loginSchema.js";

const Login = () => {
    const {register, handleSubmit, formState: {errors}} = useForm({
        defaultValues: {
            email: "",
            password: ""
        },
        resolver: yupResolver(loginSchema)
    });
    return (
        <form className={"w-100"} onSubmit={handleSubmit((data) => console.log(data))}>
            <div className={"row"}>
                <div className={"col-lg-5 col-md-7 col-sm-10 mx-auto"}>
                    <div className="text-center mb-7">
                        <Link to="/" className="navbar-brand me-0">
                            <img style={{width: "100px"}}

                                 className="brand-img d-inline-block" src="https://soliton.co.ke/img/logo.svg"
                                 alt="brand"/>
                        </Link>
                    </div>
                    <div className={"card card-lg card-border"}>
                        <div className={"card-body"}>
                            <h4 className="mb-4 text-center">Sign in to your account</h4>
                            <div className={"row gx-3"}>
                                <div className={"form-group col-lg-12"}>
                                    <EmailInput
                                        name={"email"}
                                        label={"Email"}
                                        register={register}
                                        error={errors.email}
                                        placeholder={"Enter your username or email"}
                                    />
                                </div>
                                <div className={"form-group col-lg-12"}>
                                    <PasswordInput
                                        name={"password"}
                                        label={"Password"}
                                        register={register}
                                        error={errors.password}
                                        placeholder={"Enter your password"}
                                    />
                                </div>

                            </div>
                            <div className="d-flex justify-content-center">
                            </div>
                            <button type={"submit"} className="btn btn-primary btn-uppercase btn-block">Login</button>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    )
}

export default Login