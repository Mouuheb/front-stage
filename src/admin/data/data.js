const data = {
    name:'Drone Discovery',
    logo:'img/logo.png',
    
    pageLink:[
        {
            name:'Home',
            path:'/admin',
            out:true
        },

        {
            name:'team',
            path:'/admin/tm',
            out:true
        },
        {
            name:'Project',
            path:'/admin/prj',
            out:true
        },
        {
            name:'Consultation',
            path:'/admin/cs',
            out:true
        },
        {
            name:'Category',
            path:'/admin/cat',
            out:false,
        },
        {
            name:'Equipment',
            path:'/admin/eq',
            out:true
        },
        

    ],
    team:{
        title:'Votre team',
        p:'',
        btn:'ajouter un mombre',
        btn2:'plus detail',
        btnDelete:'delete team',
        btnUpdate:'updeate team',
    },

    project:{
        adrs:'adresse',
        gvr:'gaverner',
        ctgr:'categorie',
        prc:'prix',
        stts:'status',
    },
    consult:{
        title:'consultations',
        btn:'voir plus',
        sjt:'Sujet',
        ph:'phone',
        eml:'Email',
        prj:'Project',

        sngl:'Consultation Details',
        name:'name',
        date:'date',
        note:'notes',
        btnDelete:'delete consultation',
        btnUpdate:'updeate consultation',

    },
    cat:{
        name:'Categories',
        btn:'Create Category',
        btnDelete:'delete category',
        btnUpdate:'updeate category',
    },
    eq:{
        title:'votre equipment',
        btn:'Add equipment',
        btnDelete:'delete equipment',
        btnUpdate:'updeate equipment',
        noEq:'No equipment found',
        details:'details',
        num:'nombre',
        name:'nom',

        
    },

};
export default data;