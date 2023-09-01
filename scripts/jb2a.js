import { Effects } from "./effects.js";
import jb2aSettings, {MODULE_NAME} from "./settings.js";
import { contentCard } from "./window_popup.js";
import { patreonDatabase } from "./jb2a_sequencer.js";
import { jb2aPatreonDatabase } from "./jb2a_sequencer.js";


let prefix = 'modules';

Hooks.once('init', async function () { 
    await jb2aSettings() 

      if (game.settings.get(MODULE_NAME, "fxmasterdb") === false) {
          // Adding specials
          if (!CONFIG.fxmaster) CONFIG.fxmaster = {};
          mergeObject(CONFIG.fxmaster, {specials: Effects});
          //console.log(`%cFXMaster Database Loaded !`, "color: green");
      }

      if(game.settings.get(MODULE_NAME, "jb2aLocation") !== 'modules' && game.settings.get(MODULE_NAME, "jb2aLocation") !== ''){
        prefix = game.settings.get(MODULE_NAME, "jb2aLocation");
      }
      
      await jb2aPatreonDatabase(prefix);
  
})

Hooks.once('ready', async function () {
   
    if (game.user.isGM) {
        if (game.settings.get(MODULE_NAME, "runonlyonce") === false) {   
            // Create Chat Message and check if version of FoundryVTT is 9 or above (game.user.id becomes game.user._id)
            if(game.release.generation > 9){
                await ChatMessage.create({
                    user: game.user._id,
                    speaker: ChatMessage.getSpeaker(),
                    content: contentCard,
                }, {})
            }
            else{
                await ChatMessage.create({
                    user: game.user.id,
                    speaker: ChatMessage.getSpeaker(),
                    content: contentCard,
                }, {})
            }


            await game.settings.set(MODULE_NAME, "runonlyonce", true);      
        }
    }

game.modules.get("jb2a_patreon").api = {
        patreonDatabase
    }
})


Hooks.on("sequencer.ready", () => {
    if (!game.modules.get('JB2A_DnD5e')?.active) {
        Sequencer.Database.registerEntries("jb2a", patreonDatabase);
    }
});

  
