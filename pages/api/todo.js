
export default function handler(req, res) {
  // get data
  if (req.method === 'GET') {
    const todos = [
      {
        id: "1",
        todo: "First todo",
        isCompleted: false,
        createdAt: "2023-05-27T10:00:00Z",
      },
      {
        id: "2",
        todo: "Second todo",
        isCompleted: true,
        createdAt: "2023-05-27T11:00:00Z",
      },
    ];
    res.status(200).json(todos);
  }

  // storing data
  if (req.method === 'POST') {
    const { id, todo, isCompleted, createdAt } = req.body;
   // action here
    res.status(200).json({ 
      id: "1",
      todo: "First todo",
      isCompleted: false,
      createdAt: "2023-05-27T10:00:00Z",
      Response: 'Created Successfully'
    });
  }

  // updating data
  if (req.method === 'PUT') {
    const { id, todo, isCompleted, createdAt } = req.body;
    // action here
    res.status(200).json({ 
      id: "1",
      todo: "First todo",
      isCompleted: false,
      createdAt: "2023-05-27T10:00:00Z",
      Response: 'Updated Successfully'
    });
  }

  // deleting data
  if (req.method === 'DELETE') {
    const { id } = req.query;
    // action here
    res.status(200).json({ 
      id: "1",
      todo: "First todo",
      isCompleted: false,
      createdAt: "2023-05-27T10:00:00Z",
      Response: 'Deleted Successfully'
    });
  } 
}

