require([
    "esri/WebMap",
    "esri/views/MapView",
    "esri/layers/FeatureLayer",
    "esri/widgets/FeatureTable",
    "esri/core/watchUtils"
], function (
    WebMap,
    MapView,
    FeatureLayer,
    FeatureTable,
    watchUtils
) {
    let selectedFeature, id;
    const features = [];

    const webmap = new WebMap({
        portalItem: {
            id: "a3ffe4c6cc234575bc55db7ebfa69227"
        }
    });//webmap

    const view = new MapView({
        map: webmap,
        container: "viewDiv",
        zoom: 8,
        center: [3, 50],
        popup: {
            dockEnabled: true,
            dockOptions: {
                buttonEnabled: false,
                breakpoint: false
            }
        }
    });//view


    // Quand la vue est prête, charge les layers et met à jour le titre
    view.when(function () {


//Création du graphics
/*

        let graphics = [
            {
                geometry: {
                    type: "point",
                    x: 3,
                    y: 50
                },
                attributes: {
                    ObjectID: 1,
                    DepArpt: "KATL",
                    MsgTime: Date.now(),
                    FltId: "UAL1"
                }
            },
        ];
*/
        //
        const featureLayer = webmap.findLayerById("OverlaySchools_2862");


        featureLayer.title = "Répartition des Hauts-de-france";
        featureLayer.outFields = ["*"];

        // Recupère les éléments html correspondant au tableau
        const appContainer = document.getElementById("appContainer");
        const tableContainer = document.getElementById("tableContainer");
        const tableDiv = document.getElementById("tableDiv");

        // Crée un tableau contenant les éléments suivants : département, chef lieu, code
        const featureTable = new FeatureTable({
            view: view, // make sure to pass in view in order for selection to work
            layer: featureLayer,
            fieldConfigs: [{
                name: "NOM_DEPT",
                label: "Nom du département",
                direction: "asc"
            },
                {
                    name: "NOM_CHF",
                    label: "Chef lieu du département"
                },
                {
                    name: "CODE_DEPT",
                    label: "Code département"
                }
            ],
            container: tableDiv
        });

        // Ajout d'un bouton afficher/masquer le tableau
        view.ui.add(document.getElementById("mainDiv"), "top-right");

        // récupération des éléments html correspondants
        const checkboxEle = document.getElementById("checkboxId");
        const labelText = document.getElementById("labelText");

        // fonction listener qui vérifie l'état du bouton
        checkboxEle.onchange = function () {
            toggleFeatureTable();
        };

        function toggleFeatureTable() {
            // vérifie si le tableau est affiché ou non pour définir l'état du bouton
            if (!checkboxEle.checked) {
                appContainer.removeChild(tableContainer);
                labelText.innerHTML =
                    "Afficher le tableau";
            } else {
                appContainer.appendChild(tableContainer);
                labelText.innerHTML =
                    "Masquer le tableau";
            }
        }

        featureTable.on("selection-change", function (changes) {

            // Si une ligne n'est pas sélectionnée dans le tableau, elle est retirée du tableau des caractéristiques.
            changes.removed.forEach(function (item) {
                const data = features.find(function (data) {
                    return data.feature === item.feature;
                });
            });

            // Si une ligne est sélectionnée, l'ajouter au tableau des caractéristiques.
            changes.added.forEach(function (item) {
                const feature = item.feature;
                features.push({
                    feature: feature
                });

                /*
                 vérifie la sélection de lignes dans le tableau des caractéristiques.
                 Si la fenêtre contextuelle est ouverte et qu'une ligne est sélectionnée
                 qui n'est pas la même caractéristique que la fenêtre contextuelle ouverte fermez la fenêtre contextuelle existante.
                 */
                if ((feature.attributes.OBJECTID !== id) && (view.popup.visible === true)) {
                    featureTable.deselectRows(selectedFeature);
                    view.popup.close();
                }
            });
        });

        /* Vérifiez la propriété visible de la fenêtre contextuelle. Une fois qu'elle est vraie,
         effacez la sélection de tableau actuelle et sélectionnez la ligne de tableau correspondante dans la fenêtre contextuelle.
         */
        watchUtils.watch(view.popup, "visible", (graphic) => {
            selectedFeature = view.popup.selectedFeature;
            if ((selectedFeature !== null) && (view.popup.visible !== false)) {
                featureTable.clearSelection();
                featureTable.selectRows(view.popup.selectedFeature);
                id = selectedFeature.getObjectId();
            }
        });
    });//fonction view.when


});//require

