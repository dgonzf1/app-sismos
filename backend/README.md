# Backend
Este backend esta hecho usando 'Ruby 3.3.0' y 'Rails 7.1.3.2'. Para verificar que estan instalados se puede realizar 
```bash
~$ ruby -v
ruby 3.3.0 (2023-12-25 revision 5124f9ac75) [x86_64-linux]

~$ rails -v
Rails 7.1.3.2
```
Tambien la base de datos requiere 
```
~$ sqlite3 --version
3.37.2
```

Una vez que lo anterior se encuentre instalado, se puede proseguir con los siguientes pasos.
 - Para instalar las 'gem' necesarias.
```
bundle install
```

 - Para crear la base de datos
```
rake db:create
rake db:migrate
```
 - Llenar la base de datos utilizando la task fill_database, que obtendra los datos de terremotos de los ultimos 30 dias.
```
rake data:fill_database
```
 - Finalmente correr el servidor
```
rails s -p 3000
```
Es importante para este caso correrlo en el puerto 3000. (Queda como un TODO hacer esto configurable)

## GET /eq_features/
Obtiene los features guardados en la base datos en el formato deseado. (Incluye paginacion). 

```
curl GET http://127.0.0.1:3000/eq_features?{page=1}&{per_page=50}&{mag_types=ml,me...etc..}
```

Tiene 3 parametros query opcionales. 
 - page: Que recibe el numero de pagina del que se desean obtener los datos.
 - per_page: Numero de features en cada pagina.
 - mag_types: String separado por comas donde se filtrara mediante el field mag_type de los features.

## POST /eq_features/add_comment
Este endpoint permite agregar un comentario a una id. Si el comentario esta vacio o incluye un ';' retorna un error. (Debido a que este ultimo caracter se usa para separar los comentarios)
```
curl -X POST -H 'Content-Type: application/json' -d '{"feature_id": "1004","body": "Test comment"}' http://127.0.0.1:3000/eq_features/add_comment
```
