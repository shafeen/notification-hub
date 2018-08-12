notification-hub
---
---

#### Authentication

**POST** : `/authenticate/signup`  
params: `{ email: String, password: String }`

**POST** : `/authenticate/login`  
params: `{ email: String, password: String }`  

#### Rendering partial views
Place template (pug/jade) files for partial pages for modules (ng-views, etc)
in their module folder found in `ng-client/`. For example: all the templates used by the navbar
can be found in `/ng-client/navbar`.

When trying to render a partial view from the client (an ng-include for example), 
use the following address format: `/partials/<module>/<view>`. 