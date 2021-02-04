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
  
  const mailTable = document.createElement('table');
  mailTable.classList.add('table');
  mailTable.classList.add('table-sm');
  mailTable.classList.add('table-bordered');

  email_view.appendChild(mailTable);
  
  fetch(`/emails/${mailbox}`)
    .then(response => response.json()
    .then(emails => {
      emails.forEach(function(email) {
        const mail = document.createElement('tr');
        mail.addEventListener('click', function(){
          load_email(email["id"]);
        });
        mailTable.appendChild(mail);
        
        if (mailbox === "sent") {
          const recipients = document.createElement('td');
          recipients.innerHTML = `${email["recipients"].join(", ")}`;
          mail.appendChild(recipients);

        } else if (mailbox === "inbox") {
          const sender = document.createElement('td');
          sender.innerHTML = `${email["sender"]}`;
          mail.appendChild(sender);
        }

        const subject = document.createElement('td');
        subject.innerHTML = `${email["subject"]}`;

        const timestamp = document.createElement('td');
        timestamp.innerHTML = `${email["timestamp"]}`;
        timestamp.style.color = "gray";
        timestamp.style.textAlign = "right";

        mail.appendChild(subject);
        mail.appendChild(timestamp);

      })
    }))
    .catch((error) => console.error(error));
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

function load_email(id) {
  console.log(id);
}