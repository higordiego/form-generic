# Poc - Formulário genérico

# Install dependencies

- Dependencies Application: ` yarn install `

# Machine Local
### Technologies needed
- Nodejs 12.18.0 or superior
- MongoDB 3.6 or superior

### Start Application
`yarn start`

### Access
- Api: *http://localhost:3000*


# CDN

Para utilização do formulário genérico precisa-se que coloque o script abaixo do body.
```html
<script src="https://libformgeneric.s3.amazonaws.com/clin.min.js"> </script>
```
Exemplo abaixo:

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Formulário genérico</title>
</head>

<body>
    
    <div id="form_generate">
    </div>
    <script src="https://libformgeneric.s3.amazonaws.com/clin.min.js"> </script>
</body>

</html>
```
## Como utilizar ?
Para utilização é necesseário os seguintes critérios
 - [x] Cadastrar uma campanha na API e suas respectivas etapas e campos do formulário.
 - [x] Colocar o ```id="form_generate"``` dentro uma div.
 - [x] inicialização a função ```formGenerate()``` conforme descrito abaixo.

 ### Função formGenerate()
Para inicialização da lib necessitamos de alguns dados descrito na criação da campanha, que são:

- [x] o hash da campanha
- [x] o (```stage```) numero do formulário correspodente aquela campanha.
- [x] a url da api que será cadastrada aqueles dados do formulário.

Exemplo de uso

```js
formGenerate({ campaign: "7f75795c-a724-11ea-bb37-0242ac130002", stage: 1, url: 'https://14b1cc272ed5.ngrok.io' })
```

### Campanhas
Para cadastrar a campanha basta informar os seguintes dados.
 - [x] o hash da campanha
 - [x] o stage da campanha
 - [x] o dependency (se há dependencia de formulário anterior)
 - [x] o body (o corpo do html que será criado)

 Exemplo abaixo do objeto json enviado para api.
 
```json
{
  "campaign": "7f75795c-a724-11ea-bb37-0242ac150002",
  "stage": 1,
  "dependency": false,
  "body": [
    {
      "name": "Nome",
      "element": "input",
      "type": "text",
      "required": true,
      "class": "form-control",
      "pattern": "[A-Za-z]{3}",
      "error": "message de error no input",
      "placeholder": "Digita o o nome rapaz"
    },
    {
      "name": "Email",
      "element": "input",
      "type": "email",
      "required": true,
      "class": "form-control",
      "error": "message de error no input",
      "placeholder": "Digita o email mano"
    },
    {
      "name": "Nos conheceu por onde ?",
      "element": "input",
      "type": "select",
      "required": false,
      "source": [
        {
          "name": "Facebook",
          "id": 1
        },
        {
          "name": "Google",
          "id": 2
        },
        {
          "name": "Qualquer outra coisa",
          "id": 3
        }
      ]
    }
  ],
  "redirect": "http://localhost:300/index2.html",
  "button": "Enviando...",
  "success": "Bem vindo a clin vc irá para outro formulário.... - (esse texto vem do backend)",
  "error": "Estamos passando por instabilidade, por favor tente novamente!"
}
```

Resultado esperado na montagem do front-end

```html
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Teste de formulário</title>
    <link type="text/css" rel="stylesheet"
        href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">
</head>

<body cz-shortcut-listen="true">

    <div id="form_generate">
        <div class="container">
            <div class="card" style="margin-top: 50px">
                <div class="card-body">
                    <form id="7f75795c-a724-11ea-bb37-0242ac130002">

                        <div class="form-group">
                            <label for="exampleInputEmail1">Nome</label>
                            <input type="text" class="form-control" id="nome" aria-describedby="emailHelp"
                                placeholder="Nome" required="">
                            <small class="form-text text-muted"></small>
                        </div>
                        <div class="form-group">
                            <label for="exampleInputEmail1">Email</label>
                            <input type="email" class="form-control" id="email" aria-describedby="emailHelp"
                                placeholder="Email" required="">
                            <small class="form-text text-muted"></small>
                        </div>
                        <div class="form-group">
                            <label for="exampleFormControlSelect1">Nos conheceu por onde ?</label>
                            <select class="form-control" id="nos conheceu por onde ?">
                                <option value="">Selecione uma Opção</option>
                                <option value="1">Facebook</option>
                                <option value="2">Google</option>
                                <option value="3">Qualquer outra coisa</option>
                            </select>
                        </div>

                        <div class="d-flex flex-row-reverse">
                            <input type="submit" class="btn btn-primary">
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
    <script src="/javascript/script.js"></script>
    <script>
        formGenerate({ campaign: "7f75795c-a724-11ea-bb37-0242ac130002", stage: 1, url: 'https://14b1cc272ed5.ngrok.io' })
    </script>


</body>

</html>
```

## Chamadas de API

**Cadastro de campanha**
```curl
curl --location --request POST 'http://localhost:3000/api/campaign' \
--header 'Content-Type: application/json' \
--data-raw ' {
  "campaign": "7f75795c-a724-11ea-bb37-0242ac150002",
  "stage": 1,
  "dependency": false,
  "body": [
    {
      "name": "Nome",
      "element": "input",
      "type": "text",
      "required": true,
      "class": "form-control",
      "pattern": "[A-Za-z]{3}",
      "error": "message de error no input",
      "placeholder": "Digita o o nome rapaz"
    },
    {
      "name": "Email",
      "element": "input",
      "type": "email",
      "required": true,
      "class": "form-control",
      "error": "message de error no input",
      "placeholder": "Digita o email mano"
    },
    {
      "name": "Nos conheceu por onde ?",
      "element": "input",
      "type": "select",
      "required": false,
      "source": [
        {
          "name": "Facebook",
          "id": 1
        },
        {
          "name": "Google",
          "id": 2
        },
        {
          "name": "Qualquer outra coisa",
          "id": 3
        }
      ]
    }
  ],
  "redirect": "http://localhost:300/index2.html",
  "button": "Enviando...",
  "success": "Bem vindo a clin vc irá para outro formulário.... - (esse texto vem do backend)",
  "error": "Estamos passando por instabilidade, por favor tente novamente!"
}'
```
