const HOW_TO_EDIT = 'Edita este formulario (menú **···** arriba a la derecha, **Edit**) y guarda: se vuelve a intentar solo. No abras otro formulario.';

function receivedStatus({ edited }) {
  return edited
    ? 'Cambios recibidos. Actualizando la web, tarda unos 2 minutos. Te aviso aquí cuando esté.'
    : 'Recibido. Publicando en la web, tarda unos 2 minutos. Te aviso aquí con el enlace.';
}

function failureStatus({ formError, runUrl }) {
  if (formError) return `No se ha publicado: ${formError}\n\n${HOW_TO_EDIT}`;
  return `No se ha publicado por un error al generar la web. Si usaste bloques \`{% ... %}\`, comprueba que cada uno está cerrado.\n\n${HOW_TO_EDIT}\n\n[Detalles técnicos](${runUrl})`;
}

function publicationStatus({ deployed, pageUrl, runUrl }) {
  if (!deployed) return {
    state: 'open',
    body: `No se ha confirmado la publicación. El contenido guardado se conserva. [Revisa la ejecución](${runUrl}) y vuelve a ejecutarla cuando se haya corregido el error.`,
  };
  return {
    state: 'closed',
    body: `Contenido publicado: [ver la página](${pageUrl}).\n\nPara cambiarlo, edita este formulario y guarda.\n\n[Detalles de la publicación](${runUrl})`,
  };
}
module.exports = { publicationStatus, receivedStatus, failureStatus };
