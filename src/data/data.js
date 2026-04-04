import { Stage } from "@react-three/drei";

const data = {
    name:'Drone Discovery',
    logo:'img/logo.png',
    pageLink:[
        {
            name:'Accueil',
            path:'/',
            out:true
        },

        {
            name:"L'équipe",
            path:'/tm',
            out:true
        },
        {
            name:'Projet',
            path:'/prj',
            out:true
        },
        {
            name:'Consultation',
            path:'/cs',
            out:true
        },
        {
            name:'Profil',
            path:'/authset',
            out:false,
        }
        

    ],
    navBtn:{
        vzbl:true,
        btnText:'Demander un devis',
        path:''
            
    },
    header:{
        img:'img/dr1.jpg',
        title:'Drone Discovery',
        p: 'Drone Discovery apporte une nouvelle perspective grâce à son expertise technique et à sa capacité à utiliser des drones',
        btn:[
            {
                vzbl:true,
                btnText:'Réservez une consultation',
                path:''
            },
            {
                vzbl:true,
                btnText:'Contactez-nous',
                path:''
            }
            
        ],

    },
    slider:{
        count:10,
        item:[
            {
                img:'img/slider1_1.png',
                id:1
            },
            {
                img:'img/slider1_2.png',
                id:2
            },
            {
                img:'img/slider1_3.png',
                id:3
            },
            {
                img:'img/slider1_4.png',
                id:4
            },
            {
                img:'img/slider1_5.png',
                id:5
            },
            {
                img:'img/slider1_6.png',
                id:6
            },
            {
                img:'img/slider1_7.png',
                id:7
            },
            {
                img:'img/slider1_8.png',
                id:8
            },
            {
                img:'img/slider1_9.png',
                id:9
            },
            {
                img:'img/slider1_10.png',
                id:10
            },
        ]
    },
    services:{
        title:'Services',
        p:"Notre entreprise de topographie fournit des services précis de levés topographiques, de cartographie et de GPS pour soutenir les projets de construction et d'aménagement.",
        element:[
            {
                id:1,
                title1:'Photogrammétrie par Drone',
                p:'Notre équipe utilise des drones pour capturer des images aériennes précises et détaillées, puis les processus photogrammétriques pour créer des cartes, des modèles et des images 3D.',
                color:1
            },
            {
                id:2,
                title1:'SIG',
                p:'Nous utilisons des systèmes d’information géographique (SIG) pour analyser, stocker, visualiser et gérer des données spatiales, vous aidant à mieux comprendre votre environnement.',
                color:2
            },
            {
                id:3,
                title1:'TOPOGRAPHIE',
                p:'Nous proposons des services de topographie de haute précision avec drones et GPS, fournissant des relevés détaillés et des modèles 3D pour des projets de construction, d’aménagement et de génie civil.',
                color:3
            },
            {
                id:4,
                title1:'Media',
                p:'Nos drones sont équipés de caméras haute résolution pour capturer des images et des vidéos de haute qualité, parfaites pour des présentations immersives et des projets de marketing.',
                color:1
            },
            {
                id:5,
                title1:'Formation',
                p:'Nous proposons des formations sur mesure pour vous apprendre à utiliser les outils et technologies les plus récentes dans le domaine de la géomatique et de l’imagerie par drone.',
                
                color:2
            },
            {
                id:6,
                title1:'Conception 3d',
                p:'Nous offrons des services de conception 3D innovants, créant des modèles numériques précis pour des projets d’ingénierie, d’urbanisme et de développement, en utilisant des technologies avancées de photogrammétrie et de modélisation.',
                color:3
            },
            
            
        ],
        footer:{
            img:'img/c7.png',
            title:'Ne perdez plus de temps !',
            p:'Prêt à passer à l’action ? Donnons vie à votre vision ! Découvrez nos services et contactez-nous dès aujourd’hui pour une consultation. Ensemble, réalisons vos projets.',
            btn:{
                txt:'Contactez Nous',
                vzbl:true,
                path:'',
            },
            path:'/cs'
        }
    },
    CaseStudies:{
        title:'Secteurs d’activité',
        p:'Nous intervenons dans divers secteurs, offrant des solutions adaptées aux besoins spécifiques de chaque domaine, allant de la construction à l’agriculture, en passant par l’énergie et l’environnement.',
        cases:[
            {
                l1:'Cartographie Precise',
                l2:'Energetique',
                l3:'Construction et Genie Civil'
            },
            {
                l1:'Environnement',
                l2:'Agriculture de precision',
                l3:'Mne et carriere'
            },
            {
                l1:'Urbanisme et amenagement du territoire',
                l2:'Foresterie et gestion des ressources naturelles',
            },
        ]
    },
    work:{
        title:'Nos Projets',
        p:'Découvrez nos projets réalisés qui illustrent notre expertise et notre engagement à fournir des solutions de haute qualité dans divers secteurs d’activité.',
        footerBtn:'voir plus',
        searchBtn:'search',
        serchTxt:'Rechercher un projet...',
    },
    team:{
        title:'Notre équipe',
        p:"Découvrez l'équipe compétente et expérimentée qui est à l'origine de notre succès.",
        btn:{
            txt:"Voir toute l'équipe",
            path:'',
            vzbl:true
        }
    },
    Contact:{
        img:'img/f2.png',
        title:'Contactez Nous',
        p:"N’hésitez pas à nous contacter pour toute question ou demande de renseignements. Notre équipe se tient à votre disposition pour vous aider et vous fournir des solutions adaptées à vos besoins.",
        btn:{
            vzbl:true,
            txt:'Envoyer un message'
        },
        stage:'Demande de stage',
        rendivo:'Render-vouez',

    },
    consultation:{
        img:'img/f2.png',
        title:'Consultation',
        p:"N’hésitez pas à nous contacter pour toute question ou demande de renseignements. Notre équipe se tient à votre disposition pour vous aider et vous fournir des solutions adaptées à vos besoins.",
        btn:{
            vzbl:true,
            txt:'Envoyer un message'
        }
    },
    footer:{
        title:'Contactez-nous:',
        info:
        [
            'Email: info@drone-discovery.tn',
            'Téléphone: +216 53 80 95 36 / +216 21 31 77 51',
            'Address: 03 Rue des usines, Megrine'

        ],
        copyRaight:'© 2026 Drone discovery.Tous droits réservés',
        privecy:'politique de confidentialité',
        button:'Abonnez-vous aux actualités',
    },
    about:{
        titre:'À propos',
        titre2:'Découvrez Un Nouveau Monde Vue Du Ciel',
        p:'Notre entreprise spécialisée dans la photogrammétrie par drone, la topographie, les SIG et la formation, vous offre des solutions de haute qualité pour vos besoins professionnels. Profitez de notre savoir-faire et découvrez un nouveau monde vu du ciel.',
        img:'img/about.jpg'
    },
    chat:{
        btn1Txt:'chat',
        title:'Poser une question',
        you:'Vous',
        ai:'IA',
        btn2Txt:'Envoyer',
        placeholder:'Saisissez votre message'
    },
    auth:{
        btnLogin:'Se connecter',
        titleLogin:'Se connecter',
        username:"Nom d'utilisateur",
        password:'Mot de passe',
        btn2Txt:'Envoyer',
        placeholder:'Tapez votre message',
        create:'Créer un compte',
        forgetpass:'Mot de passe oublié',
        email:'Email',
        fname:'Prénom',
        lname:'Nom',
        tel:'Numéro de téléphone',
        cpwd:'Confirmez le mot de passe',
        sup:'Créer un compte',
        mess1:'Vous avez déjà un compte?',
        title2:'Créer un compte',
        title3:'Mon profil',
        welcome:'Bonjour',
        logout:'Déconnexion'
    },
    conversation:{
        title:'Vos conversations',
        loadmessage:'Chargement des conversations...',
        noCnvMess:"Vous n'avez pas encore de conversations",
        startCnv:'Commencer une conversation',
        creating:'Création en cours...',
        cnvId:'Conversation',
        cnvParticipants:'Participants',
        unknown:'Inconnu',
        placeholder:'Tapez un message...',
        send:'Envoyer',
        sending:'Envoi en cours...'
    }

};

export default data;