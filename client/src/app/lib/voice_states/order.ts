import { createMachine } from 'xstate';

export const orderMachine = createMachine({
    /** @xstate-layout N4IgpgJg5mDOIC5QHsBOEyoHQEsIBswBiAZQBcBDVMgVwAcBtABgF1FQ7lYcydkA7diAAeiAMwAWLEyYBOAIwAmABwB2eWICsW2coBsAGhABPRPNVZlYppr3XNqiWLGzbAXzdG0GbLEr8IACNjIgB1CgBrMGY2JBBObl4BIVEEcws9ZQlZMT1FWQkJJmUHI1M01ywlPVU9TU1lWRki1Q8vdEwsEjBCAGMyAAJkOiT+IgBhVDAKMjABgHkO1BihBJ4+QTjUi01FSU1ZBXk6u3kyxEU9eSxa1UVd3XumsTaQb07uql6ACwGAW2QGCIABE8AN+MhBjQApg-BQAis4mtRilEABaMRqKqYzROeTyZRqVT6c5pPRMaR6K4SS6NfG4zSvd7YT6oH7-QHEACCEAgAwAkrM-oiOFx1sktuixCoqkxMUxjlSimJVKTpZosBIHFpjspihJ5PUmUsutM2b8AUDxsg-nRCLMhksRfExSjJQg0fIbJZ8nU5DSrCoziZEIULIUmMT5DkVFllMafFhFj4BsCBMRrfxePwaHNmc7kRtUR7FArLGINPlFDSlMU1aoxFVZHkmBI9IcnI4E51k5hU+miAAxNB-GYLJ2sVauovuz1yLCKVQHLSt5RKFWGEMIBzXex1RrWVTqbu+fxBEIkb40MgQZAAd34BenEtAqWrmpqEkcmjkWm0WVJY4KSYKlDVkdRnCsOwPE8EAIQweA4mZKdEhnV90ScDUNBKPECSJEktzRdssCpApS0kAkVEUeQT1wAgwBQ8VNnQj18UUBdDkxPFmz2NdSTXTVDkOJQGysAlGVg5ksDhAJgkYt0WN1LBdkkHImEUcj6n465siEkTMQrEpaO6PpBmGBSXVQl8RDMXYsAUGoVyXUs1E0UlLmuW4NJcOoJEJCRjLNdlLQYpFn2YmzWKuKo8TqaVwKsL93OirynEKBovwCySTV7VB+34ULRSsiLUk9aN7I0ZtIK1Q1F1JH9lEsGwamUJ4VFyWiCrvAY4QdeR5LQyLPWohclxyH8-PXWpSVOLA9waNSjxomCgA */
    id: "order",
    initial: "idle",
    states: {
        "idle": {
            on: {
                Startup: "standby"
            }
        },

        "standby": {
            on: {
                Wake: "Select option",
                Shutdown: "idle"
            }
        },

        "Select option": {
            on: {
                "Create Order": "Search mode"
            }
        },

        "Search mode": {
            on: {
                "Did not understand": {
                    target: "Search mode",
                    reenter: true
                },

                "Add Item": "Search mode",

                "Complete order": {
                    target: "Order Done",
                    reenter: true
                }
            }
        },

        "Order Done": {
            on: {
                "Continue order": "Search mode",
                "Format Order": "new state 1"
            }
        },

        "new state 1": {}
    }
});
