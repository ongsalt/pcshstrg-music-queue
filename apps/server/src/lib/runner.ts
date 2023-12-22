/**
 * Handle autostart(system, timing), wire everything together
 */

export class Runner {
    /**
     * Main system switch
     */
    isOn = true

    /**
     * Status indicator 
     * Inactive mean app is waiting for autostart
     */
    isActive = false

}