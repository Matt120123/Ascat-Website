
document.addEventListener('DOMContentLoaded', () => {
    const eventsGrid = document.getElementById('events-grid');
    const loadMoreButton = document.getElementById('load-more');
    const spinner = document.getElementById('spinner');
    const loadingText = document.getElementById('loading-text');
    const categoryTitle = document.getElementById('category-title');
    const resultsCount = document.getElementById('results-count');
    const searchInput = document.getElementById('search-input');
    let visibleEvents = 0;
    const maxEventsPerLoad = 6;
    const loadingDelay = 800;

    /*
     {
            imgSrc: 
            title: 
            date: 
            description:
            category: 
            link:
        },
    */

    const allEvents = [
        {
            imgSrc: '/AsiaSourceiCollege/src/Events-Image/14.png',
            title: "ASiC's Literary Day",   
            date: 'July 10, 2024',
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Incidunt fuga molestias dolorem nemo facilis voluptatum!',
            category: 'Announcement',
            link:'https://www.facebook.com/photo/?fbid=1114748710439461&set=a.598713812042956'    
        },
        {
            imgSrc: '/AsiaSourceiCollege/src/Events-Image/1 (1).jpg',
            title: 'Mr and Ms Asia Source iCollege 2024',   
            date: 'June 21, 2024',
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Incidunt fuga molestias dolorem nemo facilis voluptatum!',
            category: 'Events',
            link:'/AsiaSourceiCollege/Home.html'
        },
        {
            imgSrc: '/AsiaSourceiCollege/src/Events-Image/2.jpg',
            title: 'Sports Festival Awarding Ceremony',   
            date: 'June 21, 2024',
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Incidunt fuga molestias dolorem nemo facilis voluptatum!',
            category: 'Events',
            link:'/AsiaSourceiCollege/Home.html'
        },
        {
            imgSrc: '/AsiaSourceiCollege/src/Events-Image/3 (1).png',
            title: 'Sports Festival',   
            date: 'June 18, 2024',
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Incidunt fuga molestias dolorem nemo facilis voluptatum!',
            category: 'Events',
            link:'/AsiaSourceiCollege/Home.html'
        },
        {
            imgSrc: '/AsiaSourceiCollege/src/Events-Image/4.jpg',
            title: 'Strand Festival',   
            date: 'June 18, 2024',
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Incidunt fuga molestias dolorem nemo facilis voluptatum!',
            category: 'Events',
            link:'/AsiaSourceiCollege/Home.html'
        },
        {
            imgSrc: '/AsiaSourceiCollege/src/Events-Image/5.jpg',
            title: 'Company Partners Appreciation Day',   
            date: 'June 18, 2024',
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Incidunt fuga molestias dolorem nemo facilis voluptatum!',
            category: 'Events',
            link:'/AsiaSourceiCollege/Home.html'
        },
    
        {
            imgSrc: '/AsiaSourceiCollege/src/Events-Image/6.jpg',
            title: 'Trip To Baguio | Field Trip',   
            date: 'April 16, 2027',
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Incidunt fuga molestias dolorem nemo facilis voluptatum!',
            category: 'Events',
            link:'/AsiaSourceiCollege/Home.html'
        },
    
        {
            imgSrc: '/AsiaSourceiCollege/src/Events-Image/7.jpg',
            title: 'ASiC Feb Ibig',   
            date: 'Feb 24, 2024',
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Incidunt fuga molestias dolorem nemo facilis voluptatum!',
            category: 'Events',
            link:'/AsiaSourceiCollege/Home.html'
        },
        {
            imgSrc: '/AsiaSourceiCollege/src/Events-Image/8.jpg',
            title: 'Ngiti ng Pasko | Christmas Caroling',   
            date: 'Dec 15, 2024',
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Incidunt fuga molestias dolorem nemo facilis voluptatum!',
            category: 'Events',
            link:'/AsiaSourceiCollege/Home.html'
        },
        {
            imgSrc: '/AsiaSourceiCollege/src/Events-Image/9 (1).jpg',
            title: 'Year End Party',   
            date: 'Dec 15, 2024',
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Incidunt fuga molestias dolorem nemo facilis voluptatum!',
            category: 'Events',
            link:'/AsiaSourceiCollege/Home.html'
        },
        {
            imgSrc: '/AsiaSourceiCollege/src/Events-Image/10.jpg',
            title: 'K-Dance Party',   
            date: 'Dec 15, 2024',
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Incidunt fuga molestias dolorem nemo facilis voluptatum!',
            category: 'Events',
            link:'/AsiaSourceiCollege/Home.html'
        },
        {
            imgSrc: '/AsiaSourceiCollege/src/Events-Image/11.jpg',
            title: 'MEETING DE AVANCE',   
            date: 'Dec 15, 2024',
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Incidunt fuga molestias dolorem nemo facilis voluptatum!',
            category: 'Events',
            link:'/AsiaSourceiCollege/Home.html'
        },
        {
            imgSrc: '/AsiaSourceiCollege/src/Events-Image/12.jpg',
            title: '10th Foundation Anniversary',   
            date: 'Nov 28, 2024',
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Incidunt fuga molestias dolorem nemo facilis voluptatum!',
            category: 'Events',
            link:'/AsiaSourceiCollege/Home.html'
        },
        {
            imgSrc: '/AsiaSourceiCollege/src/Events-Image/13.png',
            title: 'Buwan ng Wika',   
            date: 'June 29, 2026',  
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Incidunt fuga molestias dolorem nemo facilis voluptatum!',
            category: 'Events',
            link:'/AsiaSourceiCollege/Home.html'
        },
        {
            title: 'ABOUT ASIA SOURCE iCOLLEGE',   
            date: ' ',
            description: "Asia Source iCollege was established on November 27, 2013 under the leadership of Mr. Fernando G. Dulce. The school is on its present location at the 4th Floor of Gate 3 Plaza, along Lawton Avenue corner Juliano Ave in AFPOVAI Phase III, Western Bicutan, Taguig City. The School's guiding principle is communicated in its motto, “Your Success is our Goal.”",
            category: 'ABOUT ASiC',
            link:'/AsiaSourceiCollege/AboutUs.html'
        },
        {
            
            title: 'VISION',   
            date: ' ',
            description: "Asia Source envisions to be the premier institution that produces mora    lly upright leaders with technological and entreprenuerial expertise and is actively responsive to the challenges and the needs of the global market...”",
            category: 'ABOUT ASiC',
            link:'/AsiaSourceiCollege/AboutUs.html#vision'                                                                
        },
        {
            title: 'MISSION',   
            date: ' ',
            description: "Asia Source iCollege has an ardent commitment for excellence. It provides a high quality education with an innovative way of thinking through its work of the art and dynamic facilties. This educational institution is th...”",
            category: 'ABOUT ASiC',
            link:'/AsiaSourceiCollege/AboutUs.html#mission'
        },
        {
            imgSrc: 'fallback-img.jpg',
            title: 'GET IN TOUCH',   
            date: ' ',
            description: "Asia Source iCollege has an ardent commitment for excellence. It provides a high quality education with an innovative way of thinking through its work of the art and dynamic facilties. This educational institution is th...”",
            category: 'CONTACT',
            link:'/AsiaSourceiCollege//Contact.html'
        },
    
    ]; 

    const sortEventsByDate = (events) => {
        return events.sort((a, b) => new Date(b.date) - new Date(a.date));
    };

    const loadEvents = (filteredEvents, titleText, showResultsCount = false) => {
    categoryTitle.textContent = titleText;
    const sortedEvents = sortEventsByDate(filteredEvents);
    const remainingEvents = sortedEvents.length - visibleEvents;
    const eventsToLoad = Math.min(maxEventsPerLoad, remainingEvents);

    loadMoreButton.classList.add('loading');
    loadMoreButton.disabled = true;

    setTimeout(() => {
        for (let i = 0; i < eventsToLoad; i++) {
            const event = sortedEvents[visibleEvents + i];
            const eventCard = document.createElement('div');
            eventCard.classList.add('card');

            const eventDate = new Date(event.date);
            const currentDate = new Date();
            const isFutureEvent = eventDate > currentDate;
            const dateIconClass = isFutureEvent ? 'green' : 'grey';
            const dateIconImg = `<img src="/AsiaSourceiCollege/src/imagesSource/Event-Clock.png" class="date-icon ${dateIconClass}" alt="Event Icon" width="16" height="16">`;

            eventCard.innerHTML = `
                <a href="${event.link}"><img onerror="this.style.display='none'" class = "card-img" src="${event.imgSrc}" alt=" "></a>
                <div class="card-content">
                    <h3>${event.title}</h3>
                    <p class="date">
                        ${event.category === 'Events' ? dateIconImg : ''}${event.category === 'Announcement' ? dateIconImg : ''}${event.date}
                    </p>
                    <p class="date">Posted in<strong> ${event.category}</strong></p>
                     <p class="date">Posted in<strong> ${event.description}</strong></p>
                    <a href="${event.link}" class="read-more"><button>Read More</button></a>
                </div>
            `;

            eventsGrid.appendChild(eventCard);
        }

        visibleEvents += eventsToLoad;

        loadMoreButton.classList.remove('loading');
        loadMoreButton.disabled = false;
        loadingText.textContent = 'Load More';

        if (visibleEvents >= sortedEvents.length) {
            loadMoreButton.style.display = 'none';
        }
    }, loadingDelay);

    // Display number of results only during search
    if (showResultsCount) {
        resultsCount.textContent = `${sortedEvents.length} results found`;
        resultsCount.style.display = 'block';
    } else {
        resultsCount.style.display = 'none';
    }
};

    const show404Error = () => {
        document.querySelector('.news-section').innerHTML = `
            <div class="error-container">
                <img src="/AsiaSourceiCollege/src/imagesSource/404 Error.png" alt="404 Not Found">
                <br>
                <button onclick="window.location.href='/AsiaSourceiCollege/Home.html'">Home</button>
            </div>
        `;
    };

    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('search');
    const category = urlParams.get('category');

    if (searchQuery) {
        const filteredEvents = allEvents.filter(event =>
            event.title.toLowerCase().includes(searchQuery) ||
            event.date.toLowerCase().includes(searchQuery) ||
            event.category.toLowerCase().includes(searchQuery)
        );

        if (filteredEvents.length > 0) {
            loadEvents(filteredEvents, `Search Result For "${searchQuery.charAt(0).toUpperCase() + searchQuery.slice(1)}"`, true);
        } else {
            show404Error();
        }
    } else if (category) {
        const filteredEvents = allEvents.filter(event => event.category === category);
        loadEvents(filteredEvents, category.charAt(0).toUpperCase() + category.slice(1));
    } else {
        loadEvents(allEvents, "Updates");
    }

    loadMoreButton.addEventListener('click', () => {
        if (searchQuery) {
            const filteredEvents = allEvents.filter(event =>
                event.title.toLowerCase().includes(searchQuery) ||
                event.date.toLowerCase().includes(searchQuery) ||
                event.category.toLowerCase().includes(searchQuery)
            );
            loadEvents(filteredEvents, `Search Result For: ${searchQuery.charAt(0).toUpperCase() + searchQuery.slice(1)}`, true);
        } else if (category) {
            const filteredEvents = allEvents.filter(event => event.category === category);
            loadEvents(filteredEvents, category.charAt(0).toUpperCase() + category.slice(1));
        } else {
            loadEvents(allEvents, "Updates");
        }
    });

    
});
