import Image from 'next/image';
import { Table, Button, Stack } from 'react-bootstrap';
import { useRoot } from '../contexts/RootContext';
import FormImage from './FormImage';
import FormVideo from './FormVideo';
import FormWebsite from './FormWebsite';

const SubmissionAssets = ({ submission, mutate }) => {
  const { showModal, hideModal, openForm } = useRoot();

  const onSubmitAssets = () => {
    mutate();
    hideModal();
  };

  const editAsset = (asset) => {
    const FormComponent = asset.type === 'image' ? FormImage : asset.type === 'video' ? FormVideo : FormWebsite;
    openForm(`Edit ${asset.type}`, <FormComponent submission={submission} assetData={asset} onSubmit={onSubmitAssets} hideModal={hideModal} />);
  };

  const deleteAsset = async (assetId) => {
    if (confirm('Are you sure?')) {
      await fetch(`/api/assets/${assetId}`, { method: 'DELETE' });
      mutate();
    }
  };

  const getAssetLink = (asset) => {
    return asset.type === 'image' ? <Image layout="responsive" width={asset.imageWidth} height={asset.imageHeight} src={asset.imageURL} alt={asset.title} role="button" onClick={() => showModal({size: 'lg', body: <img src={asset.imageURL} alt={asset.title} className="img-fluid" />})} />
    : asset.type === 'video' ? <a href={asset.url} target="_blank" rel="noreferrer"><i className="bi bi-film fs-3"></i></a>
    : asset.type === 'website' ? <a href={asset.url} target="_blank" rel="noreferrer"><i className="bi bi-globe2 fs-3"></i></a>
    : <i className="bi bi-question-circle"></i>
  };

  return (
    <>
      {submission.assets?.length > 0 && <Table size="sm">
        <thead>
          <tr>
            <th>Sort</th>
            <th></th>
            <th>Title</th>
            <th>Artist</th>
            <th>Year</th>
            <th>Properties</th>
            <th>Description</th>
            <th className="text-end">Tools</th>
          </tr>
        </thead>
        <tbody>
          {submission.assets.map((asset, index) => (
            <tr key={index}>
              <td width="20"><i className="bi-list fs-2" role="button"></i></td>
              <td>{getAssetLink(asset)}</td>
              <td>{asset.title}</td>
              <td>{asset.artist}</td>
              <td>{asset.year}</td>
              <td>{asset.dimensions || asset.duration}</td>
              <td style={{whiteSpace: 'pre-line'}}>{asset.description}</td>
              <td>
                <Stack direction="horizontal" gap={1} className="justify-content-end">
                  <Button variant="warning" size="sm" onClick={() => editAsset(asset)}><i className="bi bi-pencil-fill"></i></Button>
                  <Button variant="danger" size="sm" onClick={() => deleteAsset(asset._id)}><i className="bi bi-trash-fill"></i></Button>
                </Stack>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>}
      <Stack direction="horizontal" gap={1}>
        <Button variant="primary" onClick={() => openForm('Add Image', <FormImage submission={submission} onSubmit={onSubmitAssets} hideModal={hideModal} />)}>Add Image</Button>
        <Button variant="primary" onClick={() => openForm('Add Video', <FormVideo submission={submission} onSubmit={onSubmitAssets} hideModal={hideModal} />)}>Add Video</Button>
        <Button variant="primary" onClick={() => openForm('Add Website', <FormWebsite submission={submission} onSubmit={onSubmitAssets} hideModal={hideModal} />)}>Add Website</Button>
      </Stack>
    </>
  );
};

export default SubmissionAssets;