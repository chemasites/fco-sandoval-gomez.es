const { publicationStatus } = require('./publication-status');
const options = { pageUrl: 'https://example.com/article/', runUrl: 'https://github.com/example/actions/runs/1' };
test('never closes a failed deployment', () => {
  const result = publicationStatus({ ...options, deployed: false });
  expect(result.state).toBe('open');
  expect(result.body).not.toContain('Contenido publicado');
  expect(result.body).toContain(options.runUrl);
});
test('closes a confirmed deployment and links the page', () => {
  const result = publicationStatus({ ...options, deployed: true });
  expect(result.state).toBe('closed');
  expect(result.body).toContain(options.pageUrl);
  expect(result.body).not.toMatch(/traducci|idiomas/i);
});
test('tells the author the form mistake and how to retry', () => {
  const { failureStatus } = require('./publication-status');
  const body = failureStatus({ formError: 'Fecha no válida.', runUrl: options.runUrl });
  expect(body).toContain('Fecha no válida.');
  expect(body).toContain('Edita este formulario');
  expect(body).not.toContain(options.runUrl);
  expect(failureStatus({ formError: '', runUrl: options.runUrl })).toContain(options.runUrl);
});
test('acknowledges a new form and an edit differently', () => {
  const { receivedStatus } = require('./publication-status');
  expect(receivedStatus({ edited: false })).toContain('Publicando');
  expect(receivedStatus({ edited: true })).toContain('Cambios recibidos');
});
