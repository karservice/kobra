# Expanding objects
Most API resources contain relations to other resources, represented by URLs. 
Certain resources allow expanding selected properties, meaning that the whole 
referenced object will be included in the response. This is achieved by setting 
the `expand` request parameter accordingly. 

The resources supporting expansion of objects note this in their corresponding 
documentation.

Multiple properties can be expanded by separating them with commas.

Expandsions are only allowed on read-only requests.
