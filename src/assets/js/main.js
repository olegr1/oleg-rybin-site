{
    let orSkillBars,
        orSkillsMarker;

    const setSkillsBarWidth = () => {
        orSkillBars.forEach(element => {
            element.style.width = (element.dataset.years * 10) + "px";
        });
    }

    document.addEventListener('DOMContentLoaded', function() {

        orSkillsMarker = document.getElementById("orSkillsMarker");

        orSkillBars = document.querySelectorAll("#orSkillList > li .or-skill-bar");    
        

        const observer = new IntersectionObserver(function (entries) {
    
            if (entries.length > 0 && entries[0].intersectionRatio === 1) {
                setSkillsBarWidth();
                observer.unobserve(orSkillsMarker);
            }                
        },
        {
            root: null,
            rootMargin: "0px",
            threshold: 1.0,
        });

        observer.observe(orSkillsMarker);
    })

}
