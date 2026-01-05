import { BaseRoute } from "./BaseRoute";
import { AuthController } from "../controllers/AuthController";
import { BaseController } from "../controllers/BaseController";
import { AuthService } from "../services/AuthService";
import { ProtectedResetPasswordRoutes } from "../middlewares/authMiddleware";
import { protectedRoutes } from "../middlewares/authMiddleware";
export class AuthRoute extends BaseRoute {
  private controller: AuthController;
  constructor() {
    super();
    this.controller = new AuthController(AuthService.getInstance());
    this.initRoutes();
  }

  initRoutes() {
    this.router.post(
      "/signUp",
      BaseController.handleRequest(this.controller.signUp.bind(this.controller))
    );

    this.router.post(
      "/signIn",
      BaseController.handleRequest(this.controller.signIn.bind(this.controller))
    );

    this.router.post(
      "/signInAdmin",
      BaseController.handleRequest(
        this.controller.signInAdmin.bind(this.controller)
      )
    );

    this.router.post(
      "/signOut",
      BaseController.handleRequest(
        this.controller.signOut.bind(this.controller)
      )
    );

    this.router.post(
      "/signOutAdmin",
      BaseController.handleRequest(
        this.controller.signOutAdmin.bind(this.controller)
      )
    );

    this.router.post(
      "/refresh",
      BaseController.handleRequest(
        this.controller.refreshToken.bind(this.controller)
      )
    );

    this.router.post(
      "/refreshAdmin",
      BaseController.handleRequest(
        this.controller.refreshTokenAdmin.bind(this.controller)
      )
    );

    this.router.post(
      "/forget-password",
      BaseController.handleRequest(
        this.controller.forgetPassword.bind(this.controller)
      )
    );

    this.router.post(
      "/verify-otp",
      BaseController.handleRequest(
        this.controller.verifyOTP.bind(this.controller)
      )
    );

    this.router.post(
      "/verify-register-otp",
      BaseController.handleRequest(
        this.controller.verifyRegisterOTP.bind(this.controller)
      )
    );

    this.router.post(
      "/reSend-register-otp",
      BaseController.handleRequest(
        this.controller.reSendPendingUserOTP.bind(this.controller)
      )
    );

    this.router.post(
      "/reSend-resetPassword-otp",
      BaseController.handleRequest(
        this.controller.reSendResetPasswordOTP.bind(this.controller)
      )
    );

    this.router.post(
      "/reset-password",
      ProtectedResetPasswordRoutes,
      BaseController.handleRequest(
        this.controller.resetPassword.bind(this.controller)
      )
    );

    this.router.post(
      "/change-password",
      protectedRoutes,
      BaseController.handleRequest(
        this.controller.changePassword.bind(this.controller)
      )
    );

    this.router.patch(
      "/reset-user-password",
      BaseController.handleRequest(
        this.controller.resetUserPassword.bind(this.controller)
      )
    );
  }
}
