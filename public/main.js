const update = document.querySelector('#update-button')

update.addEventListener('click', _ => {
  fetch('/cocktails', {
    method: 'put',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Smoothie',
      description: 'Yaourt liquide'
    })
  })
    .then(res => {
      if (res.ok) return res.json()
    })
    .then(response => {
      console.log(response)
    })
})

const deleteButton = document.querySelector('#delete-button')

deleteButton.addEventListener('click', _ => {
  fetch('/cocktails', {
    method: 'delete',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Smoothie'
    })
  })
    .then(res => {
      if (res === 'No quote to delete') {
        messageDiv.textContent = 'No Smoothie to delete'
      } else {
        window.location.reload(true)
      }

      // if (res.ok) return res.json()
    })
    .then(data => {
      window.location.reload()
    })
})