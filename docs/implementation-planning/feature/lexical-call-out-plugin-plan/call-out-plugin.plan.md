thanks! can you get ui-designer to design a lexical plugin so the user can add a Call Out. The plugin creates an alert style text highlight to call attention to some text. it should have three 4 options: Success, Warning, Error, and Custom. 

Custom call out: 
- displays the call out configurator  in the command menu. 
- contains an emoji selector 
- contains a field component.
    - Label: "Add Prefix" e.g." Tip" it should automatically add the colon after the prefix.  
- highlight selector use colors from the tag manager component
- insert button

Success Call Out Props
emoji: Light bulb
Prefix: Tip
highlight: brand-color-green muted

Caution Call out Props
emoji: Warning
Prefix: *Suggest a prefix*
highlight: brand-color-yellow or orange muted 

Warning Call out Props
emoji: Alert!
Prefix: *Suggest a prefix*
highlight: brand-color-red muted




