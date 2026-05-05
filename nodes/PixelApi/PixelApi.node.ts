import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeOperationError,
} from 'n8n-workflow';

export class PixelApi implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'PixelAPI',
    name: 'pixelApi',
    icon: 'file:pixelapi.svg',
    group: ['transform'],
    version: 1,
    description: 'Generate, edit, upscale images via PixelAPI',
    subtitle: '={{$parameter["operation"]}}',
    defaults: { name: 'PixelAPI' },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [{ name: 'pixelApiApi', required: true }],
    properties: [
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        options: [
          { name: 'Generate Image', value: 'generate', description: 'Generate AI image from text prompt ($0.001)' },
          { name: 'Remove Background', value: 'removeBackground', description: 'Remove background → transparent PNG ($0.010)' },
          { name: 'Upscale Image', value: 'upscale', description: 'Upscale image 4× ($0.060)' },
          { name: 'Face Restore', value: 'faceRestore', description: 'Restore blurry/old faces ($0.005)' },
          { name: 'Remove Object', value: 'removeObject', description: 'Remove unwanted objects via prompt ($0.025)' },
          { name: 'Edit Image', value: 'edit', description: 'Prompt-driven edit ($0.020)' },
          { name: 'Relight', value: 'relight', description: 'Relight a photo ($0.018)' },
        ],
        default: 'generate',
      },
      // Generate
      {
        displayName: 'Prompt',
        name: 'prompt',
        type: 'string',
        default: '',
        required: true,
        displayOptions: { show: { operation: ['generate', 'removeObject', 'edit'] } },
        description: 'Text prompt describing the desired output',
      },
      // Image-input operations
      {
        displayName: 'Image URL',
        name: 'imageUrl',
        type: 'string',
        default: '',
        required: true,
        displayOptions: { show: { operation: ['removeBackground', 'upscale', 'faceRestore', 'removeObject', 'edit', 'relight'] } },
        description: 'Public URL of the image to process',
      },
      // Upscale-specific
      {
        displayName: 'Scale',
        name: 'scale',
        type: 'options',
        options: [
          { name: '2×', value: 2 },
          { name: '4×', value: 4 },
        ],
        default: 4,
        displayOptions: { show: { operation: ['upscale'] } },
      },
      // Relight preset
      {
        displayName: 'Lighting Preset',
        name: 'preset',
        type: 'options',
        options: [
          { name: 'Studio Softbox', value: 'studio_softbox' },
          { name: 'Golden Hour', value: 'golden_hour' },
          { name: 'Ring Light', value: 'ring_light' },
          { name: 'Dramatic Side Light', value: 'side_light' },
          { name: 'Natural Window', value: 'natural_window' },
        ],
        default: 'studio_softbox',
        displayOptions: { show: { operation: ['relight'] } },
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];

    for (let i = 0; i < items.length; i++) {
      try {
        const operation = this.getNodeParameter('operation', i) as string;
        let endpoint = '';
        const body: Record<string, unknown> = {};

        switch (operation) {
          case 'generate':
            endpoint = '/v1/image/generate';
            body.prompt = this.getNodeParameter('prompt', i) as string;
            break;
          case 'removeBackground':
            endpoint = '/v1/image/remove-background';
            body.image_url = this.getNodeParameter('imageUrl', i) as string;
            break;
          case 'upscale':
            endpoint = '/v1/image/upscale';
            body.image_url = this.getNodeParameter('imageUrl', i) as string;
            body.scale = this.getNodeParameter('scale', i) as number;
            break;
          case 'faceRestore':
            endpoint = '/v1/image/face-restore';
            body.image_url = this.getNodeParameter('imageUrl', i) as string;
            break;
          case 'removeObject':
            endpoint = '/v1/image/remove-object';
            body.image_url = this.getNodeParameter('imageUrl', i) as string;
            body.prompt = this.getNodeParameter('prompt', i) as string;
            break;
          case 'edit':
            endpoint = '/v1/image/edit';
            body.image_url = this.getNodeParameter('imageUrl', i) as string;
            body.prompt = this.getNodeParameter('prompt', i) as string;
            break;
          case 'relight':
            endpoint = '/v1/image/relight';
            body.image_url = this.getNodeParameter('imageUrl', i) as string;
            body.preset = this.getNodeParameter('preset', i) as string;
            break;
          default:
            throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
        }

        const response = await this.helpers.httpRequestWithAuthentication.call(this, 'pixelApiApi', {
          method: 'POST',
          url: `https://api.pixelapi.dev${endpoint}`,
          body,
          json: true,
        });

        returnData.push({ json: response as Record<string, unknown>, pairedItem: { item: i } });
      } catch (err) {
        if (this.continueOnFail()) {
          returnData.push({ json: { error: (err as Error).message }, pairedItem: { item: i } });
          continue;
        }
        throw err;
      }
    }
    return [returnData];
  }
}
