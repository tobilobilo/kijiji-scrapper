<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1" /> 
    <title>Kijiji Scrapper</title>
    <meta name="description" content="Aggrégateur d'annonces Kijiji"/>
    <link rel="stylesheet" href="./css/lib/normalize.min.css">
    <link rel="stylesheet" href="./css/lib/fontawesome.all.min.css">
    <link rel="stylesheet" href="./css/style.css?v.1.0.1">
    <link rel="icon" href="favicon.ico" type="image/x-icon" />
    <script src="./js/lib/jquery-2.2.4.min.js" integrity="sha256-BbhdlvQf/xTY9gja0Dq3HiwQF8LaCRTXxZKRutelT44=" crossorigin="anonymous"></script>
    <script src="./js/lib/js.cookie.min.js"></script>
    <script src="./js/profiles.js"></script>
    <script src="./js/func.js"></script>
    <script src="./js/script.js"></script>
    <script>
    /***
    /*** Inline command for console
    
        -- delete custom rss urls checkboxes: Cookies.remove('custom-rss-urls');
    
    ***/
  </script>
</head>
<body>
    <header class="header-slice">
        <div class="centering">
            <div class="header-slice-top">
                <span class="logo-header">
                    <img src="./images/k.svg" alt="Logo">
                </span>
                <h1>Kijiji Scrapper</h1>
                <button class="parameters-toggler"><span>Paramètres de recherche</span></button>
            </div>
        </div>
    </header>
    <section class="parameters-wrapper">
        <div class="centering">
            <div id="parameters" class="opened">
                <div class="search-field-wrapper">
                    <input type="text" class="search-field" value="" placeholder="RSS url du feed kijiji" />
                    <button class="search-field-add hidden">Ajouter</button>
                </div>
                <span class="search-field-error">Url RSS Kijiji invalide</span>
                <div class="checkboxes-wrapper">
                    <button id="toggleCheckboxes" data-toggle="on" >
                        <input id="toggle-all" type="checkbox" />
                        <label for="#toggle-all" style="width:0;">&nbsp;</label>
                    </button>
                    <div class="checkboxes" id="checkboxes">
                    </div>
                </div>
                <div class="actions-wrapper">
                    <div class="action-btns">
                        <button type="button" class="search-btn action-btn"><i class="fas fa-search"></i> Rechercher</button>
                        <button type="button" class="sort-btn action-btn"><i class="fas fa-sort-amount-up-alt"></i> Trier</button>
                    </div>
                    <p class="auto-toggler">
                        <a class="auto-toggler-btn">
                            Auto &nbsp;<span class="light on active">On</span><span class="light off">Off</span>
                        </a>
                    </p>
                </div>
            </div>
        </div>
    </section>
    <main id="feed" class="centering">
    </main>
    <footer>
        <p class="by">par Jean-Pierre Rose</p>
    </footer>
</body>
</html>