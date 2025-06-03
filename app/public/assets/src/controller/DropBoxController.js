class DropBoxController {
  constructor() {
    this.btnSendFileEL = document.querySelector("#btn-send-file");
    this.inputFilesEL = document.querySelector("#files");
    this.snackModalEL = document.querySelector("#react-snackbar-root");
    this.progressBarEL = document.snackModalEl.querySelector(
      ".mc-progress-bar-fg"
    );
    this.nameFileEL = document.querySelector("#filename");
    this.timeLeftEL = document.querySelector("#timeleft");

    this.initEvents();
  }

  initEvents() {
    this.btnSendFileEL.addEventListener("click", (event) => {
      this.inputFilesEL.click();
    });
    this.inputFilesEL.addEventListener("change", (event) => {
      this.uploadTask(event.target.files);
      this.modalShow();
      this.inputFilesEL = "";
    });
  }

  modalShow(show = true) {
    this.snackModalEl.style.display = show ? "block" : "none";
  }

  uploadTask(files) {
    let promisses = [];

    [...files].forEach((file) => {
      promisses.push(
        new Promisse((resolve, reject) => {
          let ajax = new XMLHttpRequest();

          ajax.open("POST", "/upload");

          ajax.onload = (event) => {
            this.modalShow(false);
            try {
              resolve(JSON.parse(ajax.responseText));
            } catch (e) {
              reject(e);
            }
          };

          ajax.upload.onerror = (event) => {
            this.modalShow(false);
            reject(event);
          };

          ajax.onprogress = (event) => {
            this.uploadProgress();
          };

          let formData = new FormData();

          formData.append("input-file", file);

          this.startUploadTime = Date.now();

          ajax.send(formData);
        })
      );
    });
    return Promisse.all(promisses);
  }

  uploadProgress(event, file) {
    let timespent = Date.now() - this.startUploadTime;
    let loaded = event.loaded;
    let total = event.total;

    let porcent = parseInt((loaded / total) * 100);
    let timeleft = ((100 / porcent) * timespent) / porcent;

    this.progressBarEL.style.width = `${porcent}%`;

    this.nameFileEL.innerHTML = file.name;
    this.timeLeftEL.innerHTML = this.formatTimeToHuman(timeleft);
  }

  formatTimeToHuman(duration) {
    let seconds = parseInt((duration / 1000) % 60);
    let minutes = parseInt(duration / (1000 * 60)) % 60;
    let hours = parseInt(duration / (1000 * 60 * 60)) % 24;

    if (hours > 0) {
      return `${hours} horas, ${minutes} minutos e ${seconds} segundos`;
    }
    if (minutes > 0) {
      return `${minutes} minutos e ${seconds} segundos`;
    }
    if (seconds > 0) {
      return `${seconds} segundos`;
    }
    return "";
  }
}
