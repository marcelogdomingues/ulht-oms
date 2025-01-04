# Sistema de Processamento de Pedidos de Compras Online

## Descrição do Projeto
Este projeto implementa um sistema de processamento de pedidos para uma plataforma de e-commerce, chamado **Order Management System (OMS)**. O objetivo é criar e configurar a infraestrutura necessária, automatizar a implementação de componentes e integrar tecnologias modernas para garantir eficiência, escalabilidade e facilidade de manutenção.

## Estrutura do Projeto
O sistema foi projetado com uma arquitetura modular, integrando serviços locais (on-premises) e na nuvem (Azure). Aqui está uma visão geral:

### Componentes Principais
1. **Frontend:**
   - Servidores web baseados em Nginx, configurados com Traefik como reverse proxy e load balancer.
   - Configuração usando Docker e Docker Compose.

2. **Backend:**
   - Gestão de pedidos com Node.js.
   - Comunicação em tempo real e arquivamento de dados utilizando Azure Event Hub.

3. **Base de Dados:**
   - Armazenamento local utilizando MySQL para manter registros dos pedidos.

4. **Automação:**
   - Infraestrutura provisionada com **Terraform**.
   - Configuração automatizada de servidores utilizando **Ansible**.

## Tecnologias Utilizadas
- **Docker** e **Docker Compose**
- **Traefik**
- **Azure Event Hub**
- **Terraform**
- **Ansible**
- **Node.js**
- **MySQL**

## Estrutura de Pastas
O projeto está organizado da seguinte forma:

```
ULHT-OMS/
├── ansible/
│   ├── inventory.ini
│   ├── playbook.yml
├── azure/
│   ├── azure.logs
│   ├── commands.txt
├── docker/
│   ├── app/
│   ├── docker/
│   │   ├── traefik/
│   │   │   ├── traefik.yml
│   ├── docker-compose.yml
│   ├── letsencrypt/
│   │   ├── acme.json
│   ├── traefik/
│   │   ├── traefik.yml
├── sql/
│   ├── orders_db.sql
├── terraform/
│   ├── .terraform/
│   │   ├── providers/
│   │   │   ├── registry.terraform.io/
│   │   │   │   ├── hashicorp/
│   │   │   │   │   ├── azurerm/
│   │   │   │   │   │   ├── 4.14.0/
│   │   │   │   │   │   │   ├── darwin_arm64/
│   │   │   │   │   │   │   │   ├── LICENSE.txt
│   │   │   │   │   │   │   │   ├── terraform-provider-azurerm_v4.14.0_x5
│   ├── .terraform.lock.hcl
│   ├── commands.txt
│   ├── main.tf
│   ├── terraform.tfstate
├── README.md
```

## Configuração do Projeto

### 1. Configuração Local com Docker e Traefik

#### Passos:
1. Certifique-se de ter o **Docker** e o **Docker Compose** instalados.
2. Navegue até o diretório `docker/`.
3. Execute o comando abaixo para iniciar os serviços:
   ```bash
   docker-compose up -d
   ```
4. O Traefik estará acessível na porta 8080 (dashboard).
5. Teste as URLs configuradas para os serviços: 
   - `http://web1.localhost`
   - `http://web2.localhost`
   - `http://web3.localhost`

Nota: Deverá adicionar estes hosts ao seu ficheiro \hosts.
````
sudo nano /etc/hosts
```

### Resolução de Problemas no Nginx e Traefik

#### Configuração do Nginx
1. Acesse o contêiner `web1`:
   ```bash
   docker exec -it web1 bash
   ```

2. Verifique o arquivo de configuração padrão do Nginx:
   ```bash
   cat /etc/nginx/conf.d/default.conf
   ```

3. Certifique-se de que o arquivo inclui um bloco `server` similar ao seguinte:
   ```nginx
   server {
       listen       80;
       server_name  localhost;

       location / {
           root   /usr/share/nginx/html;
           index  index.html index.htm;
       }
   }
   ```

4. Reinicie o Nginx no contêiner:
   ```bash
   nginx -s reload
   ```

5. Confirme que o diretório `/usr/share/nginx/html` contém conteúdo. Caso contrário, adicione um arquivo de teste:
   ```bash
   echo "Hello, World!" > /usr/share/nginx/html/index.html
   ```

#### Configuração do Traefik
1. Certifique-se de que as rotas no `docker-compose.yml` estão configuradas corretamente, como:
   ```yaml
   labels:
     - "traefik.http.routers.web1.rule=Host(`web1.localhost`)"
     - "traefik.http.services.web1.loadbalancer.server.port=80"
   ```

2. Reinicie o Traefik:
   ```bash
   docker-compose down
   docker-compose up -d
   ```

3. Acesse o **Dashboard do Traefik** em `https://traefik.example.com/dashboard/#/` para verificar se os serviços e as rotas estão configurados corretamente.

4. Teste novamente as rotas usando `curl`:
   ```bash
   curl http://web1.localhost
   ```

### Configuração do Azure Event Hub

#### Passos:
1. Certifique-se de estar autenticado no Azure:
   ```bash
   az login
   ```
2. Execute os seguintes comandos para configurar o Event Hub:
   ```bash
   az group create --name ShoppingOrderGroup --location eastus
   az eventhubs namespace create --name ShoppingOrderNamespace --resource-group ShoppingOrderGroup --location eastus
   ```

### Automação com Terraform e Ansible

#### Terraform:
1. Navegue até o diretório `terraform/`.
2. Inicialize e aplique as configurações:
   ```bash
   terraform init
   terraform apply
   ```

#### Ansible:
1. Certifique-se de configurar o arquivo `inventory.ini` com os detalhes dos seus servidores.
2. Execute o playbook para configurar Node.js e MySQL:
   ```bash
   ansible-playbook -i inventory.ini playbook.yml
   ```

### Configuração da Base de Dados

#### Passos:
1. Acesse o servidor MySQL.
2. Importe o script SQL localizado em `sql/orders_db.sql`:
   ```bash
   mysql -u root -p < orders_db.sql
   ```
3. Verifique se a base de dados foi criada com sucesso:
   ```sql
   SHOW DATABASES;
   ```

## Como Correr e Testar o Projeto

1. Suba a infraestrutura local usando `docker-compose up -d`.
2. Verifique o funcionamento do Traefik no dashboard em `http://localhost:8080`.
3. Teste as rotas configuradas (`web1.localhost`, etc.) para garantir que o sistema está acessível.
4. Insira dados no banco de dados e confirme os registros utilizando MySQL.

Se encontrar problemas, consulte a seção de resolução de problemas acima para ajustes específicos.

## Autor
Este projeto foi desenvolvido como parte de uma atividade acadêmica para demonstrar o uso de tecnologias modernas no desenvolvimento de um sistema de e-commerce.

## Licença
Este projeto está licenciado sob a licença MIT. Consulte o arquivo `LICENSE` para mais detalhes.
