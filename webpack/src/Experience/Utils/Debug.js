// import * as dat from 'lil-gui'
import * as dat from 'dat.gui'
import Stats from 'stats.js'


export default class Debug
{
    constructor()
    {
        this.active = window.location.hash === '#debug';
        this.stats = new Stats();

        if(this.active)
        {
            this.ui = new dat.GUI();

            this.stats.showPanel(0);
            document.body.appendChild(this.stats.dom);
        }
    }

    measureFPSStart()
    {
        if(this.active)
            this.stats.begin();
    }

    measureFPSEnd()
    {
        if(this.active)
            this.stats.end();
    }
}