export default function parseDatestamp(timestamp) {
  let tdy = new Date().toLocaleString("pt-BR", {
    dateStyle: "short"
  })
  let ytdy = new Date(Date.now() - (1000 * 60 * 60 * 24)).toLocaleString('pt-BR', {
    dateStyle: "short"
  })
  let befYtdy = new Date(Date.now() - (1000 * 60 * 60 * 24 * 2)).toLocaleString('pt-BR', {
    dateStyle: "short"
  })
  let tmrw = new Date(Date.now() + (1000 * 60 * 60 * 24)).toLocaleString('pt-BR', {
    dateStyle: "short"
  })
  let date = new Date(timestamp).toLocaleString('pt-BR', {
    dateStyle: 'short'
  })
  let time = new Date(timestamp).toLocaleString("pt-BR", {
    timeStyle: 'short'
  })

  return (date === tdy
    ? 'Hoje'
    : date === ytdy
      ? 'Ontem'
      : date === befYtdy
        ? 'Anteontem'
        : date === tmrw
          ? 'Amanhã'
          : date) + ', ' + time
}