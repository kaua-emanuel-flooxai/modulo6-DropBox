class DropBoxController {
  constructor() {
    this.btnSendFileEL = document.querySelector("#btn-send-file");
    this.inputFilesEL = document.querySelector("#files");
    this.snackModalEl = document.querySelector("#react-snackbar-root");

    this.initEvents();
  }

  initEvents() {
    this.btnSendFileEL.addEventListener("click", (event) => {
      this.inputFilesEL.click();
    });
    this.inputFilesEL.addEventListener("change", (event) => {
      this.uploadTask(event.target.files);
      this.snackModalEl.style.display = "block";
    });
  }

  uploadTask(files) {
    let promisses = [];

    [...files].forEach((file) => {
      promisses.push(
        new Promisse((resolve, reject) => {
          let ajax = new XMLHttpRequest();

          ajax.open("POST", "/upload");

          ajax.onload = (event) => {
            try {
              resolve(JSON.parse(ajax.responseText));
            } catch (e) {
              reject(e);
            }
          };

          ajax.onerror = (event) => {
            reject(event);
          };

          let formData = new FormData();

          formData.append("input-file", file);

          ajax.send(formData);
        })
      );
    });
    return Promisse.all(promisses);
  }
}
