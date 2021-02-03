document.addEventListener('DOMContentLoaded', function () {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  document.querySelector('#compose-form').onsubmit = send_email;

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {
  const email_view = document.querySelector('#emails-view');
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  fetch(`/emails/${mailbox}`)
    .then(response => response.json()
    .then(emails => {
      emails.forEach(function(email) {
        const mail = document.createElement('div');
        email_view.appendChild(mail);

        const sender = document.createElement('h5');
        const senderText = document.createTextNode(email["sender"]);
        sender.appendChild(senderText);
        mail.appendChild(sender);

        const subject = document.createElement('p');
        const subjectText = document.createTextNode(email["subject"]);
        subject.appendChild(subjectText);
        mail.appendChild(subject);

        const time = document.createElement('p');
        const timeText = document.createTextNode(email["time"]);
        time.appendChild(timeText);
        mail.appendChild(time);

        const id = document.createElement('p');
        const idText = document.createTextNode(email["id"]);
        id.appendChild(idText);
        mail.appendChild(id);
      })
    }))
  };

function send_email(event) {
  event.preventDefault();

  const recipients = document.querySelector('#compose-recipients').value;
  const subject = document.querySelector('#compose-subject').value;
  const body = document.querySelector('#compose-body').value;

  fetch('/emails', {
    method: "POST",
    body: JSON.stringify({
      recipients: recipients,
      subject: subject,
      body: body
    })
  })
    .then(response => response.json())
    .then(result => {
      load_mailbox("sent")
      console.log("sent");
    })
    .catch((error) => console.log(error));
}