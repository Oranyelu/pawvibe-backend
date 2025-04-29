export const isAdmin = (req: { user: any; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { message: string; }): any; new(): any; }; }; }, next: () => any) => {
    const user = req.user;
    if (user && user.role === 'admin') return next();
    return res.status(403).json({ message: 'Admin access only.' });
  };