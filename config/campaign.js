
module.exports = [
  {
    campaign: 20,
    stage: 1,
    dependency: true,
    body: [
      { name: 'name', element: 'input', type: 'text' },
      { name: 'email', element: 'input', type: 'email' },
      {
        name: 'Nos conheceu por onde ?',
        element: 'input',
        type: 'select',
        source: [
          { name: 'Facebook', id: 1 },
          { name: 'Google', id: 2 },
          { name: 'Qualquer outra coisa', id: 3 }
        ]
      }
    ],
    submit: 'http://localhost:3000/form'
  },
  {
    campaign: 20,
    stage: 2,
    dependency: true,
    body: [
      { name: 'name', element: 'input', type: 'text' },
      { name: 'phone', element: 'input', type: 'email' }
    ],
    submit: 'http://localhost:3000/form'
  },
  {
    campaign: 20,
    stage: 3,
    dependency: false,
    body: [
      { name: 'name', element: 'input', type: 'text' },
      { name: 'phone', element: 'input', type: 'email' },
      { name: 'cpf', element: 'input', type: 'text' }
    ],
    submit: 'http://localhost:3000/form'
  }
]
