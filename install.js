let deferredPrompt;

window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferredPrompt = event;
    const installButton = document.getElementById("installButton");
    installButton.style.display = "block";

    installButton.addEventListener("click", () => {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === "accepted") {
                console.log("PWA instalada correctamente.");
            } else {
                console.log("El usuario canceló la instalación.");
            }
            deferredPrompt = null;
        });
    });
});
