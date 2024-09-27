
interface MenyProps {
  title:string;
  items: string[];
}

const MenyList: React.FC<MenyProps> = ({ title, items = [] }) => {
  return (
    <div className="text-black dark:text-white mb-16 font-light">
    <h2 className="text-xl underline mb-4">{title}</h2>
    <ul>
        {Array.isArray(items) ? items.map((item, index) => (
          <li key={index} className="my-3 text-base">{item}</li>
        )) : <li>Inga rätter tillgängliga</li>}
      </ul>
  </div>
  );
};

export default MenyList