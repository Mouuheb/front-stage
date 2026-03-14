import { Stage } from "@react-three/drei";

const data = {
    name:'Drone Discovery',
    logo:'img/logo.png',
    pageLink:[
        {
            name:'Home',
            path:'/',
            out:true
        },

        {
            name:'team',
            path:'/tm',
            out:true
        },
        {
            name:'Project',
            path:'prj',
            out:true
        },
        {
            name:'Consultation',
            path:'/cs',
            out:true
        },
        {
            name:'profile',
            path:'/authset',
            out:false,
        }
        

    ],
    navBtn:{
        vzbl:true,
        btnText:'Request a quote',
        path:''
            
    },
    header:{
        img:'img/dr1.jpg',
        title:'Drone Discovery',
        p: 'Drone Discovery apporte une nouvelle perspective grâce à son expertise technique et à sa capacité à utiliser des drones',
        btn:[
            {
                vzbl:true,
                btnText:'Book a consultation',
                path:''
            },
            {
                vzbl:true,
                btnText:'Contact Us',
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
        title:'services',
        p:'At our digital marketing agency, we offer a range of services to help businesses grow and succeed online. These services include:',
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
        element:[
            {
                id:1,
                num:'01',
                title:'Consultation',
                p:'During the initial consultation, we will discuss your business goals and objectives, target audience, and current marketing efforts. This will allow us to understand your needs and tailor our services to best fit your requirements.',

            },
            {
                id:2,
                num:'02',
                title:'Research and Strategy Development',
                p:'During the initial consultation, we will discuss your business goals and objectives, target audience, and current marketing efforts. This will allow us to understand your needs and tailor our services to best fit your requirements.',

            },
            {
                id:3,
                num:'03',
                title:'Implementation',
                p:'During the initial consultation, we will discuss your business goals and objectives, target audience, and current marketing efforts. This will allow us to understand your needs and tailor our services to best fit your requirements.',

            },
            {
                id:4,
                num:'04',
                title:'Monitoring and Optimization',
                p:'During the initial consultation, we will discuss your business goals and objectives, target audience, and current marketing efforts. This will allow us to understand your needs and tailor our services to best fit your requirements.',

            },
            {
                id:5,
                num:'05',
                title:'Reporting and Communication',
                p:'During the initial consultation, we will discuss your business goals and objectives, target audience, and current marketing efforts. This will allow us to understand your needs and tailor our services to best fit your requirements.',

            },
            {
                id:6,
                num:'06',
                title:'Continual Improvement',
                p:'During the initial consultation, we will discuss your business goals and objectives, target audience, and current marketing efforts. This will allow us to understand your needs and tailor our services to best fit your requirements.',

            }
        ],
        footerBtn:'voir plus',
        searchBtn:'search',
        serchTxt:'Rechercher un projet...',
    },
    team:{
        title:'Team',
        p:'Meet the skilled and experienced team behind our successful digital marketing strategies',
        element:[
            {
                id:1,
                img:'img/p1.png',
                name:'John Smith',
                post:'CEO and Founder',
                p:'10+ years of experience in digital marketing. Expertise in SEO, PPC, and content strategy',
                social:[
                    {
                        // icon:`<FaLinkedinIn/>`,
                        path:''

                    }
                ]
            },
            {
                id:2,
                img:'img/p2.png',
                name:'Jane Doe',
                post:'Director of Operations',
                p:'7+ years of experience in project management and team leadership. Strong organizational and communication skills',
                social:[
                    {
                        // icon:`<FaLinkedinIn/>`,
                        path:''

                    }
                ]
            },
            {
                id:3,
                img:'img/p3.png',
                name:'Michael Brown',
                post:'Senior SEO Specialist',
                p:'5+ years of experience in SEO and content creation. Proficient in keyword research and on-page optimization',
                social:[
                    {
                        // icon:`<FaLinkedinIn/>`,
                        path:''

                    }
                ]
            },
            {
                id:4,
                img:'img/p4.png',
                name:'Emily Johnson',
                post:'PPC Manager',
                p:'3+ years of experience in paid search advertising. Skilled in campaign management and performance analysis',
                social:[
                    {
                        // icon:`<FaLinkedinIn/>`,
                        path:''

                    }
                ]
            },
            {
                id:5,
                img:'img/p5.png',
                name:'Brian Williams',
                post:'Social Media Specialist',
                p:'4+ years of experience in social media marketing. Proficient in creating and scheduling content, analyzing metrics, and building engagement',
                social:[
                    {
                        // icon:`<FaLinkedinIn/>`,
                        path:''

                    }
                ]
            },
            {
                id:6,
                img:'img/p6.png',
                name:'Sarah Kim',
                post:'Content Creator',
                p:'2+ years of experience in writing and editing Skilled in creating compelling, SEO-optimized content for various industries',
                social:[
                    {
                        // icon:`<FaLinkedinIn/>`,
                        path:''

                    }
                ]
            }
        ],
        btn:{
            txt:'See all Team',
            path:'',
            vzbl:true
        }
    },
    testimonials:{
        title:'Testimonials',
        p:'Hear from Our Satisfied Clients: Read Our Testimonials to Learn More about Our Digital Marketing Services',
        comment:[
            {
                id:1,
                txt:'"We have been working with Positivus for the past year and have seen a significant increase in website traffic and leads as a result of their efforts. The team is professional, responsive, and truly cares about the success of our business. We highly recommend Positivus to any company looking to grow their online presence."',
                auther:'John Smith',
                post:'Marketing Director at XYZ Corp',
            },
            {
                id:2,
                txt:'"We have been working with Positivus for the past year and have seen a significant increase in website traffic and leads as a result of their efforts. The team is professional, responsive, and truly cares about the success of our business. We highly recommend Positivus to any company looking to grow their online presence."',
                auther:'John Smith',
                post:'Marketing Director at XYZ Corp',
            },
            {
                id:3,
                txt:'"We have been working with Positivus for the past year and have seen a significant increase in website traffic and leads as a result of their efforts. The team is professional, responsive, and truly cares about the success of our business. We highly recommend Positivus to any company looking to grow their online presence."',
                auther:'John Smith',
                post:'Marketing Director at XYZ Corp',
            },
        ]
    },
    Contact:{
        img:'img/f2.png',
        title:'Contactez Nous',
        p:"N’hésitez pas à nous contacter pour toute question ou demande de renseignements. Notre équipe se tient à votre disposition pour vous aider et vous fournir des solutions adaptées à vos besoins.",
        btn:{
            vzbl:true,
            txt:'send message'
        },
        stage:'stage',
        rendivo:'render-vouez',

    },
    consultation:{
        img:'img/f2.png',
        title:'Consultation',
        p:"N’hésitez pas à nous contacter pour toute question ou demande de renseignements. Notre équipe se tient à votre disposition pour vous aider et vous fournir des solutions adaptées à vos besoins.",
        btn:{
            vzbl:true,
            txt:'send message'
        }
    },
    footer:{
        title:'Contact us:',
        info:
        [
            'Email: info@drone-discovery.tn',
            'Phone: +216 53 80 95 36 / +216 21 31 77 51',
            'Address: 03 Rue des usines, Megrine'

        ],
        copyRaight:'© 2026 Drone discovery. All Rights Reserved',
        privecy:'Privacy Policy',
        button:'Subscribe to news',
    },
    about:{
        titre:'À propos',
        titre2:'Découvrez Un Nouveau Monde Vue Du Ciel',
        p:'Notre entreprise spécialisée dans la photogrammétrie par drone, la topographie, les SIG et la formation, vous offre des solutions de haute qualité pour vos besoins professionnels. Profitez de notre savoir-faire et découvrez un nouveau monde vu du ciel.',
        img:'img/about.jpg'
    },
    chat:{
        btn1Txt:'chat',
        title:'Ask a quation',
        you:'you',
        ai:'ai',
        btn2Txt:'send',
        placeholder:'Type your message'
    },
    auth:{
        btnLogin:'Log in',
        titleLogin:'Log in',
        username:'username',
        password:'password',
        btn2Txt:'send',
        placeholder:'Type your message',
        create:'create account',
        forgetpass:'Forget password',
        email:'email',
        fname:'first name',
        lname:'last name',
        tel:'phone number',
        cpwd:'Confirm Password',
        sup:'create account',
        mess1:'Already have an account?',
        title2:'Create Account',
        title3:'My Profile',
        welcome:'Bonjour ',
        logout:'logout'
    },
    conversation:{
        title:'Vos conversations',
        loadmessage:'Loading conversations...',
        noCnvMess:'You have no conversations yet',
        startCnv:'Start a Conversation',
        creating:'Creating...',
        cnvId:'Conversation',
        cnvParticipants:'Participants',
        unknown:'Unknown',
        placeholder:'type message...',
        send:'send',
        sending:'sending'



    }

};

export default data;