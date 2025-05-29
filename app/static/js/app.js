function habilitarExistencia(checkboxId, inputId) {
    const checkbox = document.getElementById(checkboxId);
    const input = document.getElementById(inputId);

    if (!checkbox || !input) return;

    checkbox.addEventListener("change", function () {
        input.disabled = !this.checked;
    });
}

document.addEventListener("DOMContentLoaded", () => {
    habilitarExistencia("inventariableChk", "existenciaFld")
})