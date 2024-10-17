export function postForm(url, payload, target = '_blank') {
  if (!url) {
    return;
  }
  const hiddenForm = document.createElement('form');
  hiddenForm.action = url;
  hiddenForm.method = 'POST';
  hiddenForm.target = target;
  const token = document.createElement('input');
  token.type = 'hidden';
  token.name = 'csrf_token';
  token.value = (document.getElementById('csrf_token') || {}).value;
  hiddenForm.appendChild(token);
  const data = document.createElement('input');
  data.type = 'hidden';
  data.name = 'form_data';
  data.value = safeStringify(payload);
  hiddenForm.appendChild(data);

  document.body.appendChild(hiddenForm);
  hiddenForm.submit();
  document.body.removeChild(hiddenForm);
}
