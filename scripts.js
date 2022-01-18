const burgerMenu = document.querySelector('.burger-menu');
const mobileNav = document.querySelector('.mobile-nav');
burgerMenu.addEventListener('click', () => {
    //mobileNav.style.display = (mobileNav.style.display !== 'block') ? 'block' : 'none';
    
    if(mobileNav.style.display !== 'block') {
        mobileNav.style.display = 'block';
        window.setTimeout( () => {
            burgerMenu.classList.toggle('active');
            burgerMenu.classList.toggle('inactive');
            mobileNav.classList.toggle('open');
        }, 1);
        
    }
    else {
        mobileNav.classList.toggle('open');
        burgerMenu.classList.toggle('active');
        burgerMenu.classList.toggle('inactive');
        window.setTimeout( () => {
            mobileNav.style.display ='none';
        }, 200);
    }
    
});

//so nav takes up whole screen;
mobileNav.style.height = `${document.body.scrollHeight}px`;
