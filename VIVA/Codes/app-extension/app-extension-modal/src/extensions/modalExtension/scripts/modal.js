const modalDiv = document.createElement('div');
modalDiv.classList.add('modal');
modalDiv.id = 'myModal';

modalDiv.innerHTML = `
	  <div class="modal-content">
		<span class="close">&times;</span>
		<h2>This is a pop-up window.</h2>
		<p><a href="https://www.bing.com/" target="_blank">Go to Bing!</a></p>
        <p><a href="https://www.google.com/" target="_blank">Go to Google!</a></p>
	  </div>
	`;

document.getElementsByTagName('body')[0].appendChild(modalDiv);

var modal = document.getElementById("myModal");
modal.style.display = "block";

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];


// When the user clicks on <span> (x), close the modal
span.onclick = function () {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}