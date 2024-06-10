import {Outlet} from "react-router-dom";

const AuthLayout = () => {
    return (
        <div className="hk-wrapper hk-pg-auth" data-footer="simple">
            <div className="hk-pg-wrapper pt-0 pb-xl-0 pb-5">
                <div className={"hk-pg-body pt-0 pb-xl-0"}>
                    <div className={"container-xxl"}>
                        <div className={"row"}>
                            <div className={"col-sm-10 position-relative mx-auto"}>
                                <div className={"auth-content py-8"}>
                                    <Outlet/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AuthLayout;