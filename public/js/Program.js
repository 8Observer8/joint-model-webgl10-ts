define(["require", "exports", "./WebGLContext", "./Scene3D"], function (require, exports, WebGLContext_1, Scene3D_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Prorgam = /** @class */ (function () {
        function Prorgam() {
        }
        Prorgam.Main = function () {
            if (!WebGLContext_1.WebGLContext.Init("renderCanvas")) {
                return;
            }
            new Scene3D_1.default();
        };
        return Prorgam;
    }());
    // Debug version
    Prorgam.Main();
});
// Release version
// window.onload = () => Prorgam.Main();
//# sourceMappingURL=Program.js.map