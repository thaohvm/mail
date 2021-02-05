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
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  const mailTable = document.createElement('table');
  mailTable.classList.add('table');
  mailTable.classList.add('table-sm');
  mailTable.classList.add('table-bordered');

  const emails_view = document.querySelector('#emails-view');
  emails_view.appendChild(mailTable);

  fetch(`/emails/${mailbox}`)
    .then(response => response.json()
      .then(emails => {
        emails.forEach(function (email) {
          const mail = document.createElement('tr');
          mail.addEventListener('click', function () {
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
  document.querySelector('#emails-view').style.display = "none";

  const email_view = document.querySelector('#email-view');
  email_view.style.display = "block";

  fetch(`/emails/${id}`)
    .then(response => response.json())
    .then(email => {
      email_view.innerHTML = `
        <p><strong>From: </strong> ${email["sender"]}</p>
        <p><strong>To: </strong> ${email["recipients"].join(", ")}</p>
        <p><strong>Subject: </strong> ${email["subject"]}</p>
        <p><strong>Timestamp: </strong> ${email["timestamp"]}</p>
        <button class="btn btn-sm btn-outline-primary" id="email-view-reply">Reply</button>
        <hr>
        <p>${email["body"]}</p>
      `
      document.querySelector('#email-view-reply').addEventListener('click', () => reply_email());

      // Mark email as read
      fetch(`/emails/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
          read: true
        })
      })
    })
    .catch((error) => console.log(error));
}

function reply_email() {
  console.log("Reply clicked!")
}
