# React Parent Child Table
An example of how to display data that has parent child hierarchy in a table where each element (row) can have other tables as can have table as a child
- Sort by any element in table
- Search using any element
- Expand and collapse
- Propreties to display in table can are configurable
## Input
```json
[
  {
    "parentId": "1",
    "name": "Parent1",
    "children": [
      {
        "childId": 1,
        "firstChildName": "FirstChild1",
        "children": [
          {
            "grandChildId": 1,
            "grandChildName": "grandChild1"
          }
        ]
    }
    ]
  }
]
```

## Screenshots
![screenshot1](screenshots/1.png?raw=true "screenshot1")  
![screenshot2](screenshots/2.png?raw=true "screenshot2")  
![screenshot3](screenshots/3.png?raw=true "screenshot3")  
![screenshot4](screenshots/4.png?raw=true "screenshot3")  