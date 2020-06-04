
const makeElemets = (data) => data.reduce((acc, el) => {
  acc += `${generateFormBaseElement(el)}\n`
  return acc
}, '')
const getTemplate = (data) => `
<div class="container">
    <form style="margin-top: 50px">\n
        ${makeElemets(data)}
    <button type="submit" class="btn btn-primary" click()>Salvar</button>
<div>
</form>`

/**
 * @param  {number} campaign
 * @param  {number} stage
 * @return {void}
 */
const formGenerate = async ({ url, campaign, stage }) => {
  try {
    if (!campaign || typeof campaign !== 'number') throw new Error('Parâmetro campanha inválido!')
    if (!stage || typeof stage !== 'number') throw new Error('Parâmetro etapa inválido!')
    const response = await searchFormApi(url, campaign, stage)
    const template = getTemplate(response.body)
    window.document.getElementById('form_generate').innerHTML = template
  } catch (error) {
    console.log('error', error)
  }
}

const requestApi = (url, method) => {
  return window.fetch(url, {
    method,
    headers: new window.Headers({
      'Content-Type': 'application/json'
    })
  }).then(response => response.json())
}

/**
 * @param  {string} url
 * @return {Promise | throw}
*/
const searchFormApi = async (url, campaign, stage) => {
  const urlFetchRequest = `${url}/?campaign=${campaign}&stage=${stage}`
  return requestApi(urlFetchRequest, 'GET')
}

/**
 * @function
 * @param  {Array} data
 * @param  {Object} map
 * @return {String}
 */
const comboPopulate = (data, map) => {
  return data.reduce((acc, el) => {
    acc += `<option value="${el[map.value]}">${el[map.name]}</option>`
    return acc
  }, '')
}

/**
 * @function
 * @param  {Object} element
 * @return {{text: string, password: string, email: string, textarea: string, select: string, number}}
 */

const generateFormBaseElement = (element) => {
  const input = () => `<div class="form-group">
                                <label for="exampleInputEmail1">${element.name}</label>
                                <input type="${element.type}" class="form-control" id="${element.name}" aria-describedby="emailHelp" placeholder="${element.name}">
                                <small class="form-text text-muted"></small>
                            </div>`

  const number = () => `<div class="form-group">
                                <label for="exampleInputEmail1">${element.name}</label>
                                <input type="${element.type}" class="form-control" id="${element.name}" aria-describedby="emailHelp" placeholder="${element.name}" min="${element.min || 0}" max="${element.max || 0}" >
                                <small class="form-text text-muted"></small>
                            </div>`

  const textarea = () => `<div class="form-group">
                                <label for="exampleFormControlTextarea1">${element.name}</label>
                                <textarea class="form-control" id="${element.name}" rows="3"></textarea>
                            </div>`

  const select = () => `<div class="form-group">
                                <label for="exampleFormControlSelect1">${element.name}</label>
                                <select class="form-control" id="${element.name}">
                                ${comboPopulate(element.source, { value: 'id', name: 'name' })}
                                </select>
                           </div>`

  const types = {
    text: input,
    password: input,
    email: input,
    textarea: textarea,
    select: select,
    number: number
  }

  return (types[element.type])()
}
